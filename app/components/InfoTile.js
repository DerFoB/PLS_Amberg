import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

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
              <Text style={styles.modalText}>{decode(props.Name)}</Text>
              <Pressable
                style={styles.buttonClose}
                onPress={() => setShowDetailedInfo(!showDetailedInfo)}
              >
                <Text style={styles.buttonText}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
