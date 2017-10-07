import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';

import { ADD_POD, GET_PODS } from '../../queries';

@graphql(ADD_POD)
class AddPod extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    return (
      <View style={{ display: 'flex', marginTop: 10, flex: 1, paddingLeft: 10, paddingRight: 10 }}>
        <TextInput
          style={styles.input}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
          placeholder='New pod name'
        />
        <Button
          title="Add new pod"
          onPress={() => {
            this.props.mutate({
              variables: { name: this.state.text },
              refetchQueries: [ { query: GET_PODS } ],
            });
            this.setState({ text: '' });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 24,
  }
});

export default AddPod;