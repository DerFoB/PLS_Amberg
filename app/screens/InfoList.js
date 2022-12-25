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
import MapView, { Marker } from "react-native-maps";
import { decode } from "html-entities";

import InfoTile from "../components/InfoTile";
import colors from "../config/colors";
import configData from "../config/configData";
import {
  fetchXMLData,
  getData,
  mergeJSON,
} from "../data/DataFetchAndStorage.js";
import Icon from "../components/Icon";
import { mapStyle } from "../config/mapStyle";

function InfoList(props) {
  const [data, setData] = useState({}); //PLS data
  const [timestamp, setTimestamp] = useState({}); //last update timestamp
  const [hasLoaded, setHasLoaded] = useState(false); //if data is loaded or not
  const [showMap, setShowMap] = useState(false); //shows Map or Overview
  const [intervalRunning, setIntervalRunning] = useState(false); //so the data fetch Interval only gets triggered once

  //fetch and get the data
  useEffect(() => {
    //fires the first time, so you don't have to wait for one minute
    //wait for the first load before render
    const callApi = async () => {
      //fetch the Data from the website
      await fetchXMLData(configData.path);
      // fetch data for Markers from database
      const markerJSON = require("../data/CarparkData.json");

      //get the Data from the storage
      await getData().then((response) => {
        setData(mergeJSON(response.Daten.Parkhaus, markerJSON.Parkhaus));
        setTimestamp(response.Daten.Zeitstempel);
      });

      setHasLoaded(true);
      console.log("only once");
    };

    callApi();

    //fires every Minute
    if (!intervalRunning) {
      const interval = setInterval(() => {
        //fetch the Data from the website
        fetchXMLData(configData.path);
        // fetch data for Markers from database
        const markerJSON = require("../data/CarparkData.json");
        //get the Data from the storage
        getData().then((response) => {
          setData(mergeJSON(response.Daten.Parkhaus, markerJSON.Parkhaus));
          setTimestamp(response.Daten.Zeitstempel);
        });
        console.log("still working");
      }, 60000);
      setIntervalRunning(true);
    }
  }, []);

  if (hasLoaded) {
    //Map of Amberg
    if (showMap) {
      {
        // place Markers on Map
        var mapMarkers = data.map((carpark) => (
          <Marker
            key={carpark.ID}
            coordinate={{
              latitude: carpark.Latitude,
              longitude: carpark.Longitude,
            }}
            title={decode(carpark.Name)}
            description={carpark.Oeffnungszeiten}
            toolbarEnabled={true}
          >
            <View style={styles.markerCircle}>
              <Icon
                name="pin"
                fill={colors.secondary}
                stroke={colors.outline}
              />
              <Text style={styles.markerPinText}>{carpark.ID}</Text>
            </View>
          </Marker>
        ));

        // draw Map
        var carparkInformations = (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 49.444815,
              longitude: 11.860117,
              latitudeDelta: 0.01,
              longitudeDelta: 0.016,
            }}
            customMapStyle={mapStyle}
          >
            {mapMarkers}
          </MapView>
        );
      }
    }
    //List Overview over carparks
    else {
      {
        //map every carpark to an Infotile
        var infotiles = data.map((carpark) => (
          <TouchableOpacity
            key={carpark.ID}
            onPress={() => setShowMap(!showMap) /*Hier alert öffnen oder so */}
          >
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
          </TouchableOpacity>
        ));

        var carparkInformations = <ScrollView>{infotiles}</ScrollView>;
      }
    }
  }

  if (hasLoaded) {
    return (
      <View style={styles.container}>
        {/*Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.buttonSettings}
            onPress={() => {
              console.log("settings");
            }}
          >
            <Icon name="settings" fill={colors.background} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>PLS Amberg</Text>
            <Text style={styles.timestamp}>aktualisiert am: {timestamp}</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonMap}
            onPress={() => {
              setShowMap(!showMap);
            }}
          >
            <Icon
              name={showMap ? "listIcon" : "mapIcon"}
              fill={colors.primary}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {/*Information Display */}
        <View style={styles.informationDisplay}>{carparkInformations}</View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>PLS Amberg</Text>
        </SafeAreaView>
        <Text style={styles.timestamp}>Die Daten werden geladen.</Text>
        <Text style={styles.timestamp}>
          Falls dieser Text länger als 5 Sekunden angezeigt wird, steht entweder
          das Parkleitsystem gerade nicht zur Verfügung oder Sie haben keine
          Verbindung zum Internet.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonMap: {
    height: 70,
    aspectRatio: 1,
    backgroundColor: colors.button,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonSettings: {
    height: 70,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  container: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,

    paddingBottom: 10,
  },
  header: {
    height: 90,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  informationDisplay: {
    height: "87%",
    marginVertical: "1%",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerCircle: {
    alignItems: "center",
  },
  markerPinText: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.fontColor,
  },
  timestamp: {
    fontSize: 15,
    color: colors.fontColor,
  },
});

export default InfoList;
