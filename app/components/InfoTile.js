import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";

import colors from "../config/colors";
import Icon from "../components/Icon";
import PageMask from "./PageMask";

function InfoTile(props) {
  if (props.ID != null) {
    // trend-icon values
    const [trendName, setTrendName] = useState("minus");
    const [trendColor, setTrendColor] = useState(colors.fontColor);
    const [showDetailedInfo, setShowDetailedInfo] = useState(false);

    // changes trend-icon dependent on the incoming trend
    useEffect(() => {
      if (props.Trend < 0) {
        setTrendName("down");
        setTrendColor(colors.trendDown);
      } else if (props.Trend > 0) {
        setTrendName("up");
        setTrendColor(colors.trendUp);
      }
    }, []);

    return (
      <TouchableOpacity onPress={() => setShowDetailedInfo(true)}>
        <View style={styles.container}>
          <Text style={styles.id}>{props.ID}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{decode(props.Name)}</Text>
            <Text style={styles.space}>
              Frei: {props.Available} -- Gesamt: {props.Total}
            </Text>
            <Text style={styles.space}>
              {props.Closed != 0 ? "Geschlossen" : "Geöffnet"}
            </Text>
          </View>
          <Icon name={trendName} fill={trendColor} />
        </View>

        {/*Pop-up Detailed Information*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDetailedInfo}
          onRequestClose={() => {
            setShowDetailedInfo(!showDetailedInfo);
          }}
        >
          <PageMask />
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextName}>{decode(props.Name)}</Text>
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalTextHeader}>Parkplätze:</Text>
                <Text style={styles.modalText}>Gesamt: {props.Total}</Text>
                <Text style={styles.modalText}>Frei: {props.Available}</Text>
              </View>
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalTextHeader}>Öffnungszeiten:</Text>
                <Text style={styles.modalText}>{props.Hours}</Text>
                <Text style={styles.modalText}>
                  Gerade ist der Parkplatz{" "}
                  {props.Closed == 0 ? "geöffnet" : "geschlossen"}.
                </Text>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    console.log(props.Name);
                  }}
                >
                  <Text style={styles.buttonText}>zu Favoriten hinzufügen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowDetailedInfo(!showDetailedInfo)}
                >
                  <Text style={styles.buttonText}>Schließen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: colors.fontColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  container: {
    height: 85,
    backgroundColor: colors.secondary,
    marginVertical: 5,
    paddingHorizontal: "5%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  id: {
    fontSize: 60,
    color: colors.fontColor,
    top: -2,
  },
  info: {
    marginLeft: "5%",
    flex: 1, // pushes the trend-icon to the "bottom"/right of the flex
    top: -2,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    backgroundColor: colors.modalButton,
  },
  modalButtonContainer: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  modalText: {
    textAlign: "left",
    fontSize: 15,
    color: colors.modalFontColor,
    paddingLeft: 5,
  },
  modalTextBlock: {
    marginBottom: 15,
  },
  modalTextHeader: {
    textAlign: "left",
    fontSize: 15,
    textDecorationLine: "underline",
    color: colors.modalFontColor,
  },
  modalTextName: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: colors.modalFontColor,
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
  name: {
    fontSize: 25,
    color: colors.fontColor,
  },
  space: {
    fontSize: 15,
    color: colors.fontColor,
  },
});

export default InfoTile;
