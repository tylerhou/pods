import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import { StackNavigator } from 'react-navigation';
import Video from 'react-native-video';

import PodList from './components/Pods/PodList';
import Pod from './components/Pods/Pod';
import AddPod from './components/Pods/AddPod';

import { GET_PODS } from './queries';

import { Client, addGraphQLSubscriptions} from 'subscriptions-transport-ws';

class App extends React.Component {
  render() {
    const networkInterface = createNetworkInterface({
      uri: 'http://localhost:3000/graphql',
    });
    const wsClient = new Client({ networkInterface });

    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
      networkInterface,
      wsClient
    );

    const client = new ApolloClient({
      networkInterface: networkInterfaceWithSubscriptions,
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
  componentDidMount(){
    const varrs = (String)[data.pods.pod,data.pods.song];
    const updateFunction = data.pods.Mutation.type;
    this.subscribe(varrs, updateFunction)
  }

  subscribe(varrs, updateQuery){
    this.subscriptionObserver = this.props.client.subscribe({
      mutation: data.pods.Mutation.type,
      variables: { data.pods.Mutation.type },
    }).subscribe({next(data){data.pods.Mutation.type(varrs)}, error(err) {console.error('err', err);},
  });
  }
  render() {
    const { data, navigation } = this.props;
    console.log(this.props);
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
