import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient, createNetworkInterface, toIdValue } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import { StackNavigator } from 'react-navigation';
import Video from 'react-native-video';

import PodList from './components/Pods/PodList';
import Pod from './components/Pods/Pod';
import AddPod from './components/Pods/AddPod';

import { GET_PODS, POD_LIST_SUBSCRIPTION } from './queries';

class App extends React.Component {
  render() {
    const DOMAIN = 'www.calhacks-pods.com';
    const networkInterface = createNetworkInterface({
      uri: `https://${DOMAIN}/graphql`,
    });
    
    const wsClient = new SubscriptionClient(`wss://${DOMAIN}/subscriptions`, {
      reconnect: true,
    })

    const networkInterfaceWithSubscriptions
      = addGraphQLSubscriptions(networkInterface, wsClient)

    const client = new ApolloClient({
      networkInterface: networkInterfaceWithSubscriptions
    });

    return (
      <ApolloProvider client={client}>
        <Home />
      </ApolloProvider>
    );
  }
}

@graphql(GET_PODS)
class PodListScreen extends React.Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: POD_LIST_SUBSCRIPTION,
      variables: {
        pod_id: this.props.id,
      }, 
      updateQuery: (prev, { subscriptionData }) => ({ ...prev, pods: subscriptionData.data.podListChanged })
    });
  }

  render() {
    const { data, navigation } = this.props;
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{data.error.message}</Text> 

    return (
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <PodList pods={data.pods} onPress={(id) => navigation.navigate('Pod', { id })} />
        <AddPod />
      </View>
    )
  }
}

class PodScreen extends React.Component {
  render() {
    return (
      <Pod id={this.props.navigation.state.params.id} />
    );
  }
}

const Routes = StackNavigator({
  PodList: {
    screen: PodListScreen
  },
  Pod: {
    path: 'pods/:id',
    screen: PodScreen
  }
})

class Home extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Routes />
      </View>
    );
  }
}

export default App;
