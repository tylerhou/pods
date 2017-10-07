import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools';

const typeDefs = `
  type Pod {
    id: ID!
    name: String!
  }

  type Query {
    pods: [Pod]
  }
`

console.log(typeDefs);

const schema = makeExecutableSchema({ typeDefs });
export default schema;
