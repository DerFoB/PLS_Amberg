import { XMLParser } from "fast-xml-parser";
import AsyncStorage from "@react-native-async-storage/async-storage";

function startInterval() {
  setInterval("plsData();", 5000);
}

//fetch XML data from path
export function fetchXMLData(path) {
  var parser = new XMLParser();

  fetch(path)
    .then((result) => result.text())
    .then(
      (result) => {
        let parsedObject = parser.parse(result);
        //console.log(parsedObject);
        let jsonObject = JSON.stringify(parsedObject);
        storePLSData(jsonObject);
      },
      (error) => {
        console.log(error);
      }
    );
}

//storing the data globally with AsynchStorage
const storePLSData = async (data) => {
  try {
    await AsyncStorage.setItem("@PLSData", data);
  } catch (error) {
    console.log(error);
  }
};
