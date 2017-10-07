import gql from 'graphql-tag';

export const ADD_POD = gql`
  mutation addPod($name: String!) {
    addPod(name: $name) {
      id
      name
    }
  }
`

export const GET_PODS = gql`
  query {
    pods {
      id
      name 
      songs {
        ... on SoundCloudSong {
          id
          track_url
        }
      }
    }
  }
`

export const GET_POD = gql`
  query getPod($id: ID!) {
    pod(id: $id) {
      id
      name
      songs {
        ... on SoundCloudSong {
          id
          track_url
        }
      }
    }
  }
`

export const ADD_SONG = gql`
  mutation addSong($pod_id: ID!, $track_url: String!) {
    addSong(pod_id: $pod_id, track_url: $track_url) {
      ... on SoundCloudSong {
        id
        track_url
      }
    }
  }
`