import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import PodList from './components/Pods/PodList';
import AddPod from './components/Pods/AddPod';

import { GET_PODS } from './queries';

class App extends React.Component {
  render() {
    const networkInterface = createNetworkInterface({
      uri: 'http://localhost:3000/graphql',
    });
    const client = new ApolloClient({ networkInterface });

    return (
      <ApolloProvider client={client}>
        <Home />
      </ApolloProvider>
    );
  }
}

@graphql(GET_PODS)
class Home extends React.Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{this.props.data.error.message}</Text> 

    return (
      <View style={styles.container}>
        <PodList pods={this.props.data.pods} />
        <AddPod />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
