import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import { decode } from "html-entities";
import * as Speech from "expo-speech";

import { getDistanceFromLatLonInKm } from "../scripts/DistanceLatLon";
import { getData, mergeJSON, storeData } from "../data/DataFetchAndStorage.js";
import configData from "../config/configData";

//get nearest Carpark on User Position change and output to User with Toast and TTS
// return: void
const watchUserAndGetNearestCarpark = async (ttsEnabled) => {
  //checks for Permission to get user location
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();

  // Location tracking
  if (foregroundPermission.granted) {
    Location.watchPositionAsync(
      {
        // Tracking options
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        // shortest distance of a carpark to the user gets stored here
        var shortestDistances = {
          distance: 1000000.0,
          name: "Musterstraße",
          available: 0,
          trend: 0,
          pricePerHour: "ist nicht bekannt",
        };

        // get Carpark JSON
        const markerJSON = require("../data/CarparkData.json");

        // get PLS data
        getData(configData.storage).then((response) => {
          // itarates through all carparks and saves the one with the shortest distance
          for (const [key, value] of Object.entries(
            mergeJSON(response.Daten.Parkhaus, markerJSON.Parkhaus)
          )) {
            try {
              var distance = getDistanceFromLatLonInKm(
                location.coords.latitude,
                location.coords.longitude,
                value.Latitude,
                value.Longitude
              );
              if (distance < shortestDistances.distance) {
                shortestDistances.distance = distance;
                shortestDistances.name = value.Name;
                shortestDistances.available = value.Frei;
                shortestDistances.trend = value.Trend;
                shortestDistances.pricePerHour = value.PreisProStunde;
              }
            } catch (e) {
              console.log("Distance Problem: ", e);
            }
          }
        });

        // checks if the nearest carpark is new or was the last output
        getData(configData.lastShortestDistanceCarpark).then((response) => {
          if (
            shortestDistances.name != response &&
            shortestDistances.distance < configData.geofencingRadius
          ) {
            storeData(
              shortestDistances.name,
              configData.lastShortestDistanceCarpark
            );

            //Toast
            ToastAndroid.show(
              "Sie befinden sich in der Nähe von: \r" +
                decode(shortestDistances.name),
              ToastAndroid.SHORT
            );

            //TTS
            var trendTTS = "ist gleichbleibend. ";
            if (shortestDistances.trend < 0) {
              trendTTS = "nimmt ab. ";
            }
            if (shortestDistances.trend > 0) {
              trendTTS = "nimmt zu. ";
            }

            getData(configData.ttsSetting).then((ttsSetting) => {
              if (ttsSetting) {
                Speech.speak(
                  "Sie befinden sich in der Nähe von: " +
                    decode(shortestDistances.name) +
                    ". Es sind " +
                    shortestDistances.available +
                    " Parkplätze frei. Die Parkplatzbelegung" +
                    trendTTS +
                    "Der Preis pro Stunde " +
                    shortestDistances.pricePerHour +
                    ".",
                  { language: "de" }
                );
              }
            });
          }
        });
      }
    );
  }
};

module.exports = { watchUserAndGetNearestCarpark };
