import * as Location from "expo-location";
import { ToastAndroid } from "react-native";

import { getDistanceFromLatLonInKm } from "../scripts/DistanceLatLon";
import { getData, mergeJSON, storeData } from "../data/DataFetchAndStorage.js";
import configData from "../config/configData";

//storing the data globally with AsynchStorage
const getNearestCarpark = async (data) => {
  // shortest distance carpark
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();

  if (foregroundPermission.granted) {
    let location = await Location.getCurrentPositionAsync({});
    console.log("hier", location);
    console.log(data);
  }
};

const watchUserAndGetNearestCarpark = async () => {
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

            ToastAndroid.show("Request sent successfully!", ToastAndroid.SHORT);
            storeData(
              shortestDistances.name,
              configData.lastShortestDistanceCarpark
            );
          }
        });

        //if (shortestDistances.name != lastShortestDistanceCarpark) {
        //console.log("after", shortestDistances);
        //setLastShortestDistanceCarpark(shortestDistances.name);
        //}
      }
    );
  }
};

module.exports = { getNearestCarpark, watchUserAndGetNearestCarpark };
