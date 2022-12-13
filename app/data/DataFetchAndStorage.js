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

async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem("@Data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { fetchXMLData, getData };
