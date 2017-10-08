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
        id
        artist
        title
        stream_url 
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
        id
        artist
        title
        stream_url 
      }
    }
  }
`

export const ADD_SONG = gql`
  mutation addSong($pod_id: ID!, $track_id: String!) {
    addSong(pod_id: $pod_id, track_id: $track_id) {
      id
      artist
      title
      stream_url
    }
  }
`

export const POP_SONG = gql`
  mutation popSong($pod_id: ID!, $song_id: ID!) {
    popSong(pod_id: $pod_id, song_id: $song_id) {
      id
    }
  }
`