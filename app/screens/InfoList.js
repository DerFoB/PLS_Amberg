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
import { fetchXMLData, getData } from "../data/DataFetchAndStorage.js";
import { render } from "react-dom";

function InfoList(props) {
  const [data, setData] = useState({});
  const [timestamp, setTimestamp] = useState();

  //fetch and get the data
  useEffect(() => {
    //fires the first time, so you don't have to wait for one minute
    //fetch the Data from the website
    fetchXMLData("http://parken.amberg.de/wp-content/uploads/pls/pls.xml");
    //get the Data from the storage
    getData().then((response) => setData(response));

    console.log("only once");

    //fires every Minute
    const interval = setInterval(() => {
      //fetch the Data from the website
      fetchXMLData("http://parken.amberg.de/wp-content/uploads/pls/pls.xml");
      //get the Data from the storage
      getData().then((response) => setData(response));
      console.log("still working");
    }, 60000);
  }, []);

  useEffect(() => {
    console.log("gets triggered");
  }, [data]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>PLS Amberg</Text>
      </SafeAreaView>
      <Text>aktualisiert am: {data.Daten.Zeitstempel}</Text>
      <ScrollView>
        <TouchableHighlight onPress={() => console.log(data.Daten.Zeitstempel)}>
          <View
            style={{
              height: 100,
              backgroundColor: colors.secondary,
              marginVertical: 5,
              borderRadius: 10,
            }}
          ></View>
        </TouchableHighlight>
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
