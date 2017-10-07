import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

class PodList extends React.Component {
  render() {
    const { pods, onPress } = this.props;
    return (
      <ScrollView style={{ height: 400 }}>
        {pods.map(pod => <PodListItem {...pod} key={pod.id} onPress={() => onPress(pod.id)}/>)}
      </ScrollView>
    );
  }
}

class PodListItem extends React.Component {
  render() {
    const { id, name, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={{ paddingTop: 4, paddingRight: 10, paddingLeft: 10, paddingBottom: 4 }}>
      	<Text style={{ fontSize: 20 }}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

export default PodList
