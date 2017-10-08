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
      playing
      time_offset
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
      playing
      time_offset
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

export const POD_SUBSCRIPTION = gql`
  subscription podChanged($pod_id: ID!) {
    podChanged(pod_id: $pod_id) {
      id
      name
      songs {
        id
        title
        artist
        stream_url
      }
      playing
      time_offset
    }
  } 
`

export const POD_LIST_SUBSCRIPTION = gql`
  subscription podListChanged {
    podListChanged {
      id
      name 
      songs {
        id
        artist
        title
        stream_url
      }
      playing
      time_offset
    }
  }
`

export const SET_TIME_OFFSET = gql`
  mutation seekPod($pod_id: ID!, $time: Int!) {
    seekPod(pod_id:$pod_id, time: $time)
  }
`


export const CHANGE_PLAYING = gql`
  mutation changePlaying($pod_id: ID!, $playing: Boolean!) {
    changePlaying(pod_id: $pod_id, playing: $playing)
  }
`