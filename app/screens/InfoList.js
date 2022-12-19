import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import InfoTile from "../components/InfoTile";
import colors from "../config/colors";
import configData from "../config/configData";
import { fetchXMLData, getData } from "../data/DataFetchAndStorage.js";
import Icon from "../components/Icon";

function InfoList(props) {
  const [data, setData] = useState({}); //PLS data
  const [hasLoaded, setHasLoaded] = useState(false); //if data is loaded or not
  const [showMap, setShowMap] = useState(false); //shows Map or Overview

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
    //Map of Amberg
    if (showMap) {
      {
      }
    }
    //Overview over carparks
    else {
      {
        //map every carpark to an Infotile
        var carparks = data.Daten.Parkhaus.map((carpark) => (
          <InfoTile
            key={carpark.ID}
            ID={carpark.ID}
            Name={carpark.Name}
            Total={carpark.Gesamt}
            Current={carpark.Aktuell}
            Available={carpark.Frei}
            Trend={carpark.Trend}
            Status={carpark.Status}
            Closed={carpark.Geschlossen}
          ></InfoTile>
        ));
      }
    }
  }

  if (hasLoaded) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <View>
            <Text style={styles.title}>PLS Amberg</Text>
            <Text>aktualisiert am: {data.Daten.Zeitstempel}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Icon name="mapIcon" height="90%" width="90%" />
          </TouchableOpacity>
        </SafeAreaView>
        <ScrollView>
          <View>{carparks}</View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>PLS Amberg</Text>
        </SafeAreaView>
        <Text>Die Daten werden geladen.</Text>
        <Text>
          Falls dieser Text länger als 5 Sekunden angezeigt wird, steht entweder
          das Parkleitsystem gerade nicht zur Verfügung oder Sie haben keine
          Verbindung zum Internet.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "20%",
    height: "90%",
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1%",
  },
  container: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    height: "10%",
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default InfoList;
