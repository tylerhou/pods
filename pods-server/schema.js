import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `
  type SoundCloudSong {
    id: ID!
    track_url: String!
  }

  union Song = SoundCloudSong

  type Pod {
    id: ID!
    name: String!
    songs: [Song]
  }

  type Query {
    pods: [Pod]
  }

  type Mutation {
    addPod(name: String!): Pod
    addSong(pod_id: ID!, track_url: String!): Song
  }
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
