import AsyncStorage from "@react-native-async-storage/async-storage";
import { XMLParser } from "fast-xml-parser";

//fetch XML data from path
function fetchXMLData(path) {
  var parser = new XMLParser();

  fetch(path) //hier: "http://parken.amberg.de/wp-content/uploads/pls/pls.xml"
    .then((result) => result.text())
    .then(
      (result) => {
        let parsedObject = parser.parse(result);
        //console.log("parsedObject", parsedObject);
        storeData(parsedObject);
      },
      (error) => {
        console.log(error);
      }
    );
}

//storing the data globally with AsynchStorage
const storeData = async (data) => {
  try {
    jsonObject = JSON.stringify(data);
    //console.log("jsonObject", jsonObject);
    await AsyncStorage.setItem("@Data", jsonObject);
  } catch (error) {
    console.log(error);
  }
  console.log("Done.");
};

async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem("@Data");
    console.log("jsonValue", jsonValue);
    console.log("parse", JSON.parse(jsonValue));
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { fetchXMLData, getData };
