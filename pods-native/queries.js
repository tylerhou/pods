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
    }
  }
`
