import React from 'react';
import { Text } from 'react-native';

class Pod extends React.Component {
  render() {
    const { id, name } = this.props;
    return (
      <Text>{name}</Text>
    );
  }
}

export default Pod;