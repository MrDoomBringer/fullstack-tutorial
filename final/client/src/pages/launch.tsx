import React, { Fragment } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

import { LAUNCH_TILE_DATA } from './launches';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';

import { cache } from '../cache'

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

cache.writeQuery({
  query: GET_LAUNCH_DETAILS,
  data:{launch:{
    __typename:"Launch",
    id:"109",
    site: "Cached site",
    rocket:{
      __typename:"Rocket",
      type:"Cached Rocket",
      id:"falcon9",
      name:"Cached rocket",
    },
    isBooked:false,
    mission: {
      __typename:"Mission",
      name: "Starlink-15 (v1.0)",
      missionPatch:"https://images2.imgbox.com/d2/3b/bQaWiil0_o.png",
    }
  }},
  variables:{launchId:"109"}
})

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  var [getData, {
    data,
    loading,
    error,
  }] = useLazyQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(GET_LAUNCH_DETAILS,
    // With the "cache-only" fetchPolicy, no network requests are sent when querying. Changing this to
    // "no-cache" sends network requests and gets uncached data as usual.
    { fetchPolicy:"cache-only", variables: { launchId } }
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) {
    
    return <p> 
    <button onClick={()=>{getData({variables:launchId})}}>
      Run Lazy Query
      </button>
    </p>;
    }

  return (
    <Fragment>
      <Header image={data.launch && data.launch.mission && data.launch.mission.missionPatch}>
        {data && data.launch && data.launch.mission && data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  );
}

export default Launch;