import AsyncStorage from "@react-native-async-storage/async-storage";
import { XMLParser } from "fast-xml-parser";
import { merge } from "lodash";

//fetch XML data from path
function fetchXMLData(path) {
  var parser = new XMLParser();

  fetch(path)
    .then((result) => result.text())
    .then(
      (result) => {
        let parsedObject = parser.parse(result);
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
    await AsyncStorage.setItem("@Data", jsonObject);
  } catch (error) {
    console.log(error);
  }
};

//getting the Data from the storage of AsynchStorage
async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem("@Data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//merge two JSON Files by the key "Name"
function mergeJSON(json1, json2) {
  try {
    const objectsByName = {};

    // Store json1 objects by name.
    for (const obj1 of json1) {
      objectsByName[obj1.Name] = obj1;
    }

    for (const obj2 of json2) {
      const name = obj2.Name;

      if (objectsByName[name]) {
        // Object already exists, need to merge.
        // Using lodash's merge because it works for deep properties, unlike object.assign.
        objectsByName[name] = merge(objectsByName[name], obj2);
      } else {
        // Object doesn't exist in merged, add it.
        objectsByName[name] = obj2;
      }
    }

    // All objects have been merged or added. Convert our map to an array.
    return Object.values(objectsByName);
  } catch (error) {
    console.log(error);
    var oldData = [];
    getData().then((response) => {
      oldData = response;
    });
    return oldData;
  }
}

module.exports = { fetchXMLData, getData, mergeJSON };
