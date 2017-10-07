import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

import { StackNavigator } from 'react-navigation';

import PodList from './components/Pods/PodList';
import Pod from './components/Pods/Pod';
import AddPod from './components/Pods/AddPod';

import { GET_PODS } from './queries';


import AudioPlayer from 'react-native-play-audio';

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
class PodListScreen extends React.Component {
  render() {
    const { data, navigation } = this.props;
    console.log(this.props);
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{data.error.message}</Text>

    AudioPlayer.onEnd(() => {
      console.log('on end');
    });

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
    let jsCode =`
    while(data.pods.length>=0){
      const url =data.pods.songs[data.pods.length].track_url;
      data.pods.songs[data.pods.length].pop();
      AudioPlayer.prepare(url, () => {
      AudioPlayer.play();
      AudioPlayer.getDuration((duration) => {
        console.log(duration);
      });
      setInterval(() => {
        AudioPlayer.getCurrentTime((currentTime) => {
          console.log(currentTime);
        });
      }, currentTime+duration);
      AudioPlayer.stop();
      AudioPlayer.pause();
      AudioPlayer.setCurrentTime(50.5);}


    `
    return (
      <View>
        <Pod id={this.props.navigation.state.params.id} />
          <WebView
            injectedJavaScript = {jsCode}
            javaScriptEnabledAndroid={true}
            >
            </WebView>
        </View>
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
