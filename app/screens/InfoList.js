import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  ScrollView,
  Dimensions,
  TouchableHighlight,
} from "react-native";

import InfoTile from "../components/InfoTile";
import colors from "../config/colors";
import { callData } from "../data/PLSdata.js";

function InfoList(props) {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>PLS Amberg</Text>
      </SafeAreaView>
      <Text>aktualisiert am: </Text>
      <View style={{ height: 20, width: "100%", flexDirection: "row" }}>
        <View style={{ backgroundColor: "red", flex: 1 }}></View>
        <View style={{ backgroundColor: "blue", flex: 1 }}></View>
        <View style={{ backgroundColor: "red", flex: 1 }}></View>
        <View style={{ backgroundColor: "blue", flex: 1 }}></View>
        <View style={{ backgroundColor: "red", flex: 1 }}></View>
      </View>
      <ScrollView>
        <TouchableHighlight onPress={() => callData()}>
          <InfoTile />
        </TouchableHighlight>
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
        <InfoTile />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default InfoList;
