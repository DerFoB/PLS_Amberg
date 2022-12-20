import React from "react";
import { decode } from "html-entities";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";
import Icon from "../components/Icon";

function InfoTile(props) {
  if (props.Closed == 0) {
    //Only shows tile if carpark isnt closed
    return (
      <TouchableOpacity onPress={() => console.log(props.ID)}>
        <View style={styles.container}>
          <Text style={styles.id}>{props.ID}</Text>
          <View style={styles.info}>
            <Text>{decode(props.Name)}</Text>
            <Text>
              Frei: {props.Available}/{props.Total}
            </Text>
          </View>
          <Icon name="minus"/>
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
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  id:{
    fontSize: 60,
  },
  info:{
    fontSize: 40,
  },
});

export default InfoTile;
