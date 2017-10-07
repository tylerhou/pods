import React from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';

class App extends React.Component {
  render() {
    const URL = 'https://soundcloud.com/darude/sandstorm-radio-edit';
    return (
    <View>
      <Video source={{uri: URL}}   // Can be a URL or a local file.
         ref={(ref) => {
           this.player = ref
         }}                                      // Store reference
         rate={1.0}                              // 0 is paused, 1 is normal.
         volume={1.0}                            // 0 is muted, 1 is normal.
         muted={false}                           // Mutes the audio entirely.
         paused={false}                          // Pauses playback entirely.
         resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
         repeat={false}                           // Repeat forever.
         playInBackground={true}                // Audio continues to play when app entering background.
         playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
         ignoreSilentSwitch={"obey"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
         progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
         onLoadStart={this.loadStart}            // Callback when video starts to load
         onLoad={this.setDuration}               // Callback when video loads
         onProgress={this.setTime}               // Callback every ~250ms with currentTime
         onEnd={this.onEnd}                      // Callback when playback finishes
         onError={this.videoError}               // Callback when video cannot be loaded
         onBuffer={this.onBuffer}                // Callback when remote video is buffering
         onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
         />
      </View>
  );
  }
}

export default App;
