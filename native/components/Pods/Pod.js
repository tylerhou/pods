import React from 'react';
import { Text, View, TextInput, Button, Slider } from 'react-native';
import { graphql } from 'react-apollo';

import Video from 'react-native-video';

import { GET_POD, ADD_SONG, POP_SONG } from '../../queries';

@graphql(GET_POD)
class Pod extends React.Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{data.error.message}</Text>
    const { pod } = data;

    return (
      <View style={{ display: 'flex', flex: 1 }}>
        <Text>Pod name: {pod.name}</Text>
        <Text>Songs</Text>
        <SongList songs={pod.songs} />
        <AddSong pod_id={pod.id}/>
        {
          pod.songs.length === 0 ?
          <Text>Add a song!</Text>
          : <SongPlayer song={pod.songs[0]} pod_id={pod.id} />  
        }
      </View>      
    );
  }
}

class SongList extends React.Component {
  render() {
    const { songs } = this.props;

    return (
      <View>
        {songs.map(song => <SongListItem song={song} key={song.id} />)}
      </View>
    );
  }
}

class SongListItem extends React.Component {
  render() {
    const { song } = this.props;
    return (
      <Text>{song.title}</Text>
    );
  }
}

@graphql(ADD_SONG)
class AddSong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <View style={{ display: 'flex', marginTop: 10, flex: 1, paddingLeft: 10, paddingRight: 10 }}>
        <TextInput
          style={{ width: '100%', height: 24 }}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
          placeholder='Song track id'
        />
        <Button
          title="Add new song"
          onPress={() => {
            if (!this.state.text || this.state.text === '') return null;
            this.props.mutate({
              variables: { pod_id: this.props.pod_id, track_id: this.state.text },
              refetchQueries: [ { query: GET_POD, variables: { id: this.props.pod_id } } ],
            });
            this.setState({ text: ''});
          }}
        />
      </View>
    );
  }
}


@graphql(POP_SONG)
class SongPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  skip = (song_id, pod_id) => {
    this.props.mutate({
      variables: { pod_id: pod_id, song_id: song_id },
      refetchQueries: [ { query: GET_POD, variables: { id: pod_id } } ],
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.song.id !== this.props.song.id) this.player.seek(0);
  }

  render() {
    const { song, pod_id } = this.props;
    const { paused, time={}, status } = this.state;
    if (!song) return <Text>No internet connection</Text>;
    const current_time = time.atValue / (time.atTimescale * time.seekableDuration) || 0;
    return (
      <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
        {
          song.stream_url
          && <Video
            source={{ uri: song.stream_url }}
            ref={(ref) => this.player = ref}
            volume={1.0}
            paused={paused}
            playInBackground={true}
            playWhenInactive={true}
            onProgress={time => this.setState({ time, status: 'Playing.' })}
            onLoadStart={() => this.setState({ status: 'Loading...' })}
            onLoad={() => this.setState({ status: 'Loaded! About to play.' })}
            onError={() => this.setState({ status: 'Song error.' })}
            onBuffer={() => this.setState({ status: 'Buffering...' }) }
            onEnd={() => this.skip(song.id, pod_id)}
          />
        }
        <Text>{status === 'Playing.' && paused ? 'Paused' : status}</Text>
        <Text>Now playing: {song.title}</Text>
        <Text>Artist: {song.artist}</Text>
        <Slider value={current_time}style={{ width: '90%' }}/>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Button onPress={() => this.setState({ paused: !paused })} title="toggle play/pause" />
          <Button onPress={() => this.skip(song.id, pod_id)} title="skip" />
        </View>
      </View>
    );
  }
}

export default Pod;