import React from "react";
import { decode } from "html-entities";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function InfoTile(props) {
  if (props.ID != null) {
    return (
      <TouchableOpacity onPress={() => console.log(props.ID)}>
        <View style={styles.container}>
          <Text>{props.ID}</Text>
          <Text>{decode(props.Name)}</Text>
          <Text>
            Frei: {props.Available}/{props.Total}
          </Text>
          <Text>{props.Trend}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: colors.primary,
    marginVertical: 5,
    padding: 5,
    borderRadius: 10,
  },
});

export default InfoTile;
