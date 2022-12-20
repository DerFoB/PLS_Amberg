import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";
import Icon from "../components/Icon";

function InfoTile(props) {
  const [trendName, setTrendName] = useState("minus");
  const [trendColor, setTrendColor] = useState(colors.trendMinus);

  //Only shows tile if carpark isnt closed
  if (props.Closed == 0) {
    // changes trend-icon dependent on the incoming trend
    useEffect(() => {
      if (props.Trend < 0) {
        setTrendName("down");
        setTrendColor(colors.trendDown);
      }
      if (props.Trend > 0) {
        setTrendName("up");
        setTrendColor(colors.trendUp);
      }
    }, []);

    return (
      <TouchableOpacity onPress={() => console.log(props.ID)}>
        <View style={styles.container}>
          <Text style={styles.id}>{props.ID}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{decode(props.Name)}</Text>
            <Text style={styles.space}>
              Frei: {props.Available} -- Gesamt: {props.Total}
            </Text>
          </View>
          <Icon name={trendName} fill={trendColor} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 85,
    backgroundColor: colors.primary,
    marginVertical: 5,
    paddingHorizontal: "5%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  id: {
    fontSize: 60,
  },
  info: {
    marginLeft: "5%",
    flex: 1, // pushes the trend-icon to the "bottom"/right of the flex
  },
  name: {
    fontSize: 25,
  },
  space: {
    fontSize: 15,
  },
});

export default InfoTile;
