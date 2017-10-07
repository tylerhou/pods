import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';

import { ADD_POD, GET_PODS } from '../../queries';

@graphql(ADD_POD)
class AddPod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button
          title="Add new channel"
          onPress={() => this.props.mutate({
            variables: { name: this.state.text },
            refetchQueries: [ { query: GET_PODS } ],
          })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 100,
  }
});

export default AddPod;