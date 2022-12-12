import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { fetchXMLData } from "../data/PLSdata.js";

function InfoList(props) {
  const [data, setData] = useState({});

  //useEffect(async () => {}, []);

  const getPLSData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@PLSData");
      setData(jsonValue != null ? JSON.parse(jsonValue) : null);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        <TouchableHighlight
          onPress={() =>
            fetchXMLData(
              "http://parken.amberg.de/wp-content/uploads/pls/pls.xml"
            )
          }
        >
          <InfoTile />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => getPLSData()}>
          <InfoTile />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => console.log(data)}>
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
