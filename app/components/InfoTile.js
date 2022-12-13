import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-web";

import colors from "../config/colors";

function InfoTile(props) {
  return <View style={styles.container}></View>;
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
