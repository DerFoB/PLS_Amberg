import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import { decode } from "html-entities";
import * as Speech from "expo-speech";

import { getDistanceFromLatLonInKm } from "../scripts/DistanceLatLon";
import { getData, mergeJSON, storeData } from "../data/DataFetchAndStorage.js";
import configData from "../config/configData";

const watchUserAndGetNearestCarpark = async (ttsEnabled) => {
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();
  // Locatoin tracking inside the component
  if (foregroundPermission.granted) {
    Location.watchPositionAsync(
      {
        // Tracking options
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        var shortestDistances = {
          distance: 1000000.0,
          name: "Musterstraße",
          available: 0,
          trend: 0,
          pricePerHour: "ist nicht bekannt",
        };

        const markerJSON = require("../data/CarparkData.json");

        getData(configData.storage).then((response) => {
          //const storedData = getData(configData.storage);
          //const data = mergeJSON(storedData.Daten.Parkhaus, markerJSON.Parkhaus);

          //console.log("wat is hier", data);
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
          console.log("before", shortestDistances);
        });

        getData(configData.lastShortestDistanceCarpark).then((response) => {
          if (
            shortestDistances.name != response &&
            shortestDistances.distance < configData.geofencingRadius
          ) {
            console.log("after", shortestDistances);
            storeData(
              shortestDistances.name,
              configData.lastShortestDistanceCarpark
            );

            ToastAndroid.show(
              "Sie befinden sich in der Nähe von: \r" +
                decode(shortestDistances.name),
              ToastAndroid.SHORT
            );

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

module.exports = { getNearestCarpark, watchUserAndGetNearestCarpark };
