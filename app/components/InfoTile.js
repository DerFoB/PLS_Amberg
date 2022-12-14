import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableHighlight } from "react-native-web";

import colors from "../config/colors";

function InfoTile(props) {
  return (
    <View style={styles.container}>
      <Text>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: colors.primary,
    marginVertical: 5,
    borderRadius: 10,
  },
});

export default InfoTile;
