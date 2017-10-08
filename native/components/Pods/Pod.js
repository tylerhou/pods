import React from 'react';
import { Text, View, TextInput, Button, Slider, ScrollView, TouchableOpacity } from 'react-native';
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


class SpotifyAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { suggestions: [] };
  }

  getSuggestions = (query) => {
    console.log('query', query);
    return fetch(`https://api.soundcloud.com/tracks?q=${query}&client_id=095fe1dcd09eb3d0e1d3d89c76f5618f`)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      return response;
    });
  }

  componentDidMount() {
    this.getSuggestions(this.props.query).then(suggestions => this.setState({ suggestions }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query) {
      console.log('updated');
      this.getSuggestions(this.props.query).then(suggestions => this.setState({ suggestions }));
    }
  }

  render() {
    return (
      <ScrollView styles={{ flex: 1 }}>
        {
          this.state.suggestions.map(suggestion => {
            return(
              <TouchableOpacity
                key={suggestion.id}
                style={{ minHeight: 40 }}
                onPress={() => this.props.onPress(suggestion.id)}
              > 
                <Text style={{ fontWeight: 'bold' }} numberOfLines={1}>{suggestion.title}</Text>
                <Text numberOfLines={1}>By {suggestion.user.username}</Text>
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
    )
  }
}


@graphql(ADD_SONG)
class AddSong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addSong = (track_id, pod_id) => {
    this.props.mutate({
      variables: { pod_id, track_id },
      refetchQueries: [ { query: GET_POD, variables: { id: pod_id } } ],
    });
    this.setState({ text: '' });
  }
  
  render() {
    return (
      <View style={{ display: 'flex', marginTop: 10, flex: 1, paddingLeft: 10, paddingRight: 10 }}>
        <TextInput
          style={{ width: '100%', height: 24 }}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
          placeholder='Enter song name...'
        />
        <Button
          title="Search"
          onPress={() => {
            if (!this.state.text || this.state.text === '') return null;
            this.setState({ query: this.state.text });
          }}
        />
        <SpotifyAutoComplete query={this.state.query} onPress={(track_id) => this.addSong(track_id, this.props.pod_id)} />
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
    const songLength = time.seekableDuration || 1; 
    const currentTime = time.atValue / time.atTimescale || 0;

    const displaySeconds = (_seconds) => {
      const minutes = Math.floor(_seconds/60);
      const seconds = Math.floor(_seconds%60);
      const toTwoDigits = (number) => number < 10 ? '0' + number.toString() : number;
      return `${toTwoDigits(minutes)}:${toTwoDigits(seconds)}`;
    }
    
    return (
      <View style={{ display: 'flex', flexDirection: 'column', flex: 0, alignItems: 'center', height: 150, paddingTop: 10, paddingBottom: 10 }}>
        {
          song.stream_url
          && <Video
            source={{ uri: song.stream_url }}
            ref={(ref) => this.player = ref}
            volume={1.0}
            paused={paused}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch={"ignore"}
            onProgress={time => this.setState({ time, status: 'Playing.' })}
            onLoadStart={() => this.setState({ status: 'Loading...' })}
            onLoad={() => this.setState({ status: 'Loaded! About to play.' })}
            onError={() => this.setState({ status: 'Song error.' })}
            onBuffer={() => this.setState({ status: 'Buffering...' }) }
            onEnd={() => this.skip(song.id, pod_id)}
          />
        }
        <Text>{status === 'Playing.' && paused ? 'Paused' : status}</Text>
        <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>Now playing: {song.title}</Text>
        <Text numberOfLines={1}>Artist: {song.artist}</Text>
        <Slider maximumValue={songLength} value={currentTime} onSlidingComplete={(time) => this.player.seek(time)} style={{ width: '90%' }}/>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Button onPress={() => this.setState({ paused: !paused })} title={ paused ? "Play" : "Pause" } />
          <Button onPress={() => this.skip(song.id, pod_id)} title="skip" />
          <Text>{`${displaySeconds(currentTime)}/${displaySeconds(songLength)}`}</Text>
        </View>
      </View>
    );
  }
}

export default Pod;