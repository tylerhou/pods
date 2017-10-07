import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { graphql } from 'react-apollo';

import { GET_POD, ADD_SONG } from '../../queries';

@graphql(GET_POD)
class Pod extends React.Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <Text>Loading</Text>
    if (data.error) return <Text>{data.error.message}</Text>
    const { pod } = data;

    return (
      <View>
        <Text>Pod name: {pod.name}</Text>
        <Text>Songs</Text>
        <SongList songs={pod.songs} />
        <AddSong pod_id={pod.id}/>    
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
            this.props.mutate({
              variables: { pod_id: this.props.pod_id, track_url: this.state.text },
              refetchQueries: [ { query: GET_POD, variables: { id: this.props.pod_id } } ],
            });
            this.setState({ text: ' '});
          }}
        />
      </View>
    );
  }
}

export default Pod;