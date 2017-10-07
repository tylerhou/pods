import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

const WITH_PODS_QUERY = gql`
  query {
    pods {
      id
      name
    }
  }
`

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

const withData = graphql(WITH_PODS_QUERY);

@withData
class Home extends React.Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{this.props.data.error.message}</Text> 

    return (
      <View style={styles.container}>
        <PodsList pods={this.props.data.pods} />
        <AddPod />
      </View>
    );
  }
}

class PodsList extends React.Component {
  render() {
    const { pods } = this.props;
    return (
      <View>
        {pods.map(pod => <Pod {...pod} />)}
      </View>
    );
  }
}

class Pod extends React.Component {
  render() {
    const { id, name } = this.props;
    return (
      <Text>{name}</Text>
    );
  }
}

const ADD_POD_MUTATION = gql`
  mutation addPod($name: String!) {
    addPod(name: $name) {
      id
      name
    }
  }
`

const withMutation = graphql(ADD_POD_MUTATION, {

})

@withMutation
class AddPod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <View style={styles.addPodContainer}>
        <TextInput
          style={styles.addPodNameInput}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button
          title="Add new channel"
          onPress={() => this.props.mutate({
            variables: { name: this.state.text },
            refetchQueries: [ { query: WITH_PODS_QUERY } ],
          })}
        />
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
  addPodContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPodNameInput: {
    width: 100,
  }
});

export default App;
