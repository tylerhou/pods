import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import schema from './schema';

import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import { Server } from 'subscriptions-transport-ws';

const pubsub = new PubSub();
const SubscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentAdded: (options, args) => ({
      commentAdded: comment =>
      comment.repository_name === args.repoFullName,
    }),
  },
});


const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', bodyParser.json(), graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(3000, () =>

  console.log(`graphQL server is now running on port 3000.
    Use /graphiql for visual interaction.`)
);

const server2 = new Server({ subscriptionManager }, server );
export { subscriptionManager, pubsub };
