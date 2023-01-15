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
  Modal,
  Switch,
  PermissionsAndroid,
} from "react-native";
import MapView from "react-native-maps";
import * as Speech from "expo-speech";

import InfoTile from "../components/InfoTile";
import MapMarker from "../components/MapMarker";
import colors from "../config/colors";
import configData from "../config/configData";
import {
  fetchXMLData,
  getData,
  mergeJSON,
  storeData,
} from "../data/DataFetchAndStorage.js";
import Icon from "../components/Icon";
import { mapStyle } from "../config/mapStyle";
import PageMask from "../components/PageMask";
import { watchUserAndGetNearestCarpark } from "../data/NearestCarpark";

//main page of the app
function InfoList(props) {
  const [data, setData] = useState({}); //PLS data
  const [timestamp, setTimestamp] = useState({}); //last update timestamp
  const [hasLoaded, setHasLoaded] = useState(false); //if data is loaded or not
  const [showMap, setShowMap] = useState(false); //shows Map or Overview
  const [intervalRunning, setIntervalRunning] = useState(false); //so the data fetch Interval only gets triggered once
  const [favorites, setFavorites] = useState([]); //list of favorites picked by the user
  const [saveChanges, setSaveChanges] = useState(0); // this is only here to force useEffect to act, cause it doesnt detect changes in an array
  const [showSettings, setShowSettings] = useState(false); // if modal is open or not

  //settings
  const [ttsEnabled, setTTSEnabled] = useState(true);
  const toggleTTSSwitch = () => {
    setTTSEnabled(!ttsEnabled);
    setSaveChanges(saveChanges + 1);
  };

  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const toggleFavoritesSwitch = () => {
    setOnlyFavorites(!onlyFavorites);
    setSaveChanges(saveChanges + 1);
  };

  //callback function for child component to change favorites
  function changeFavorites(newFavorite) {
    setFavorites(newFavorite);
    setSaveChanges(saveChanges + 1);
  }

  //stores the new favorites after each change
  useEffect(() => {
    if (saveChanges != 0) {
      //so it doesnt reset if reopening the app
      storeData(favorites, configData.favorites);
      storeData(ttsEnabled, configData.ttsSetting);
      storeData(onlyFavorites, configData.favoritesSetting);
    }
    if (saveChanges > 10) {
      //to prevent stack overflow
      setSaveChanges(1);
    }

    if (!ttsEnabled) {
      Speech.stop();
    }
  }, [saveChanges]);

  //fetch and get the data
  useEffect(() => {
    //fires the first time, so you don't have to wait for one minute
    //wait for the first load before render
    const firstSetup = async () => {
      //fetch the Data from the website
      await fetchXMLData(configData.path, configData.storage);
      // fetch data for Markers from database
      // path for Carpark informations. This would normally be on a server or database,
      // but it is deposited inside the project, so the project can get tested and reviewed by the evalutaing professor
      const markerJSON = require("../data/CarparkData.json");

      //get the Data from the storage
      await getData(configData.storage).then((response) => {
        setData(mergeJSON(response.Daten.Parkhaus, markerJSON.Parkhaus));
        setTimestamp(response.Daten.Zeitstempel);
      });
      await getData(configData.favorites).then((response) => {
        setFavorites(response);
      });
      await getData(configData.ttsSetting).then((response) => {
        setTTSEnabled(response);
      });
      await getData(configData.favoritesSetting).then((response) => {
        setOnlyFavorites(response);
      });

      setHasLoaded(true);
      console.log("only once");
    };

    firstSetup();

    //activates User Position observer and nearest carpark output
    watchUserAndGetNearestCarpark(ttsEnabled);
    storeData("Musterstraße", configData.lastShortestDistanceCarpark); //so the stored data resets

    //fires every Minute
    if (!intervalRunning) {
      const interval = setInterval(() => {
        //fetch the Data from the website
        fetchXMLData(configData.path, configData.storage);
        // fetch data for Markers from database
        const markerJSON = require("../data/CarparkData.json");
        //get the Data from the storage
        getData(configData.storage).then((response) => {
          setData(mergeJSON(response.Daten.Parkhaus, markerJSON.Parkhaus));
          setTimestamp(response.Daten.Zeitstempel);
        });

        console.log("still working");
      }, 60000);
    }
    setIntervalRunning(true); //so only one interval is running
  }, []);

  if (hasLoaded) {
    //Map of Amberg
    if (showMap) {
      {
        // place Markers on Map
        var mapMarkers = data.map((carpark) => (
          <MapMarker
            key={carpark.ID}
            ID={carpark.ID}
            Latitude={carpark.Latitude}
            Longitude={carpark.Longitude}
            Name={carpark.Name}
            OpeningHours={carpark.Oeffnungszeiten}
            Closed={carpark.Closed}
            Favorites={favorites}
            OnlyFavorites={onlyFavorites}
          />
        ));

        // draw Map
        var carparkInformations = (
          <MapView
            onMapReady={() => {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION // needed to enable showsUserLocations
              );
            }}
            style={styles.map}
            initialRegion={{
              latitude: 49.444815,
              longitude: 11.860117,
              latitudeDelta: 0.01,
              longitudeDelta: 0.016,
            }}
            customMapStyle={mapStyle}
            showsUserLocation={true}
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
            Hours={carpark.Oeffnungszeiten}
            Price={carpark.Preis}
            Favorites={favorites}
            onPress={changeFavorites}
            OnlyFavorites={onlyFavorites}
          ></InfoTile>
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
              setShowSettings(true);
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

        {/*Settings */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSettings}
          onRequestClose={() => {
            setShowSettings(!showSettings);
          }}
        >
          <PageMask />
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextHeader}>Einstellungen</Text>

              <View style={styles.modalSettingsBlock}>
                <Text style={styles.modalCaption}>Sprachausgabe:</Text>
                <Switch
                  trackColor={{
                    false: colors.stateOff,
                    true: colors.modalButton,
                  }}
                  thumbColor={colors.thumb}
                  onValueChange={toggleTTSSwitch}
                  value={ttsEnabled}
                  style={styles.modalSwitch}
                />
              </View>

              <View style={styles.modalSettingsBlock}>
                <Text style={styles.modalCaption}>Nur Favoriten anzeigen:</Text>
                <Switch
                  trackColor={{
                    false: colors.stateOff,
                    true: colors.modalButton,
                  }}
                  thumbColor={colors.thumb}
                  onValueChange={toggleFavoritesSwitch}
                  value={onlyFavorites}
                  style={styles.modalSwitch}
                />
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowSettings(!showSettings)}
                >
                  <Text style={styles.modalButtonText}>Schließen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalButton: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    backgroundColor: colors.modalButton,
    width: 200,
  },
  modalButtonText: {
    color: colors.fontColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonContainer: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  modalCaption: {
    textAlign: "left",
    fontSize: 15,
    color: colors.modalFontColor,
    flex: 1,
  },
  modalTextHeader: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: colors.modalFontColor,
  },
  modalSettingsBlock: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  modalSwitch: {
    position: "relative",
    top: 3,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "75%",
    height: "50%",
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
