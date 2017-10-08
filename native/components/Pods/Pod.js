import React from 'react';
import { Text, View, TextInput, Button, Slider } from 'react-native';
import { graphql } from 'react-apollo';

import Video from 'react-native-video';

import { GET_POD, ADD_SONG } from '../../queries';

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
        <SongPlayer song={pod.songs[0]} />  
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
      <Text>{song.track_url}</Text>
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
            if (this.state.text === '') return null;
            this.props.mutate({
              variables: { pod_id: this.props.pod_id, track_url: this.state.text },
              refetchQueries: [ { query: GET_POD, variables: { id: this.props.pod_id } } ],
            });
            this.setState({ text: ''});
          }}
        />
      </View>
    );
  }
}

const CLIENT_PARAMETER = '?client_id=095fe1dcd09eb3d0e1d3d89c76f5618f';

const getSoundCloudStreamingUrl = (track_id) => {
  return fetch(`https://api.soundcloud.com/tracks/${track_id}${CLIENT_PARAMETER}`)
  .then(response => response.json())
};

class SongPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    getSoundCloudStreamingUrl(this.props.song.track_url).then(source => {
      this.setState({ source })
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const { source, paused } = this.state;
    if (!source) return <Text>No internet connection</Text>;
    return (
      <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
        {
          source.stream_url && <Video
            source={{ uri: source.stream_url + CLIENT_PARAMETER }}
            ref={(ref) => this.player = ref}
            volume={1.0}
            paused={paused}
            playInBackground
            playWhenInactive
          />
        }
        <Text>Now playing: {source.title}</Text>
        <Text>Artist: {source.user.username}</Text>
        <Slider style={{ width: '90%' }}/>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Button onPress={() => this.setState({ paused: !paused })} title="toggle play/pause" />
          <Button onPress={() => this.setState({ paused: !paused })} title="skip" />
        </View>
      </View>
    );
  }
}

export default Pod;