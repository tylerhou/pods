import React, {Component} from 'react';
import { Button, StyleSheet, Text, View, Au } from 'react-native';

// const _handlePlaySoundAsync = [
//   'https://ncs-files-1.nyc3.digitaloceanspaces.com/mp3s/Alan%20Walker%20-%20Force.mp3',
// ];
//
// var SC = require('soundcloud');
//
// <script src="https://connect.soundcloud.com/sdk/sdk-3.2.2.js"></script>
// <script>
//   SC.initialize({
//     client_id: 'YOUR_CLIENT_ID',
//     redirect_uri: 'http://example.com/callback'
//   });
// </script>
//
//
// SC.initialize({
//   client_id: 'YOUR_CLIENT_ID',
//   redirect_uri: 'http://example.com/callback'
// });
//
// SC.get('/user/183/tracks').then(function(tracks){
//   alert('Latest track: ' + tracks[0].title);
// });

// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//     <title>Connect with SoundCloud</title>
//   </head>
//   <body onload="window.setTimeout(window.opener.SC.connectCallback, 1)">
//     <b style="text-align: center;">This popup should automatically close in a few seconds</b>
//   </body>
// </html>

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to2 Apolgloasdf</Text>
        <Button
          title="Play a sound!"
          onPress={this._handlePlaySoundAsync}
        />
      </View>
    );
  }
  _handlePlaySoundAsync = async() => {
    await Audio.setIsEnabledAsync(true);
    const sound = new Audio.Sound();
    await sound.loadAsync({
      uri: 'https://www.englishdom.com/staticus/child.mp3'
    });
    await sound.playAsync();
    this.sound = sound;
    this.setState({
      showPlayAgain: true
    });
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
