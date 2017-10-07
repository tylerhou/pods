import React from 'react';
import { View } from 'react-native';

import Pod from './Pod';

class PodList extends React.Component {
  render() {
    const { pods } = this.props;
    return (
      <View>
        {pods.map(pod => <Pod {...pod} />)}
      </View>
    );
  }
}

export default PodList