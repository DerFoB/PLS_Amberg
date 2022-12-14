import React, { useEffect, useState } from "react";
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
import configData from "../config/configData";
import { fetchXMLData, getData } from "../data/DataFetchAndStorage.js";

function InfoList(props) {
  const [data, setData] = useState({}); //PLS data
  const [hasLoaded, setHasLoaded] = useState(false); //if data is loaded or not

  //fetch and get the data
  useEffect(() => {
    //fires the first time, so you don't have to wait for one minute
    //wait for the first load before render
    const callApi = async () => {
      //fetch the Data from the website
      await fetchXMLData(configData.path);
      //get the Data from the storage
      await getData().then((response) => setData(response));

      setHasLoaded(true);
      console.log("only once");
    };

    callApi();

    //fires every Minute
    const interval = setInterval(() => {
      //fetch the Data from the website
      fetchXMLData(configData.path);
      //get the Data from the storage
      getData().then((response) => setData(response));
      console.log("still working");
    }, 60000);
  }, []);

  /*useEffect(() => {
    console.log("gets triggered");
    if (data != null) {
      setTimestamp(data.Daten.Zeitstempel);
    }
  }, [data]);*/

  if (hasLoaded) {
    {
      var carpark = data.Daten.Parkhaus.map((carpark) => (
        <Text key={carpark.ID}>{carpark.Name}</Text>
      ));
    }
  }

  if (hasLoaded) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>PLS Amberg</Text>
        </SafeAreaView>
        <Text>aktualisiert am: {data.Daten.Zeitstempel}</Text>
        <View>{carpark}</View>
        <ScrollView>
          <TouchableHighlight
            onPress={() => console.log(data.Daten.Parkhaus[1].ID)}
          >
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
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>PLS Amberg</Text>
        </SafeAreaView>
        <Text>keine Internetverbindung</Text>
      </View>
    );
  }
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
