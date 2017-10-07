import React from 'react';
import { Text, Head, Body } from 'react-native';

class Pod extends React.Component {
  render() {
    const { id, name } = this.props;
    return (
      <Text>{name} {id}</Text>
    );
  }
}

export default Pod;
