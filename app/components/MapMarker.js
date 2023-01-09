import { Marker } from "react-native-maps";
import { decode } from "html-entities";
import { View, StyleSheet, Text } from "react-native";

import Icon from "../components/Icon";
import colors from "../config/colors";

function MapMarker(props) {
  if (props.ID != null) {
    var marker = (
      <Marker
        key={props.ID}
        coordinate={{
          latitude: props.Latitude,
          longitude: props.Longitude,
        }}
        title={decode(props.Name)}
        description={props.OpeningHours}
        toolbarEnabled={true}
      >
        <View style={styles.markerCircle}>
          <Icon
            name="pin"
            fill={props.Closed ? colors.outline : colors.secondary}
            stroke={colors.outline}
          />
          <Text style={styles.markerPinText}>{props.ID}</Text>
        </View>
      </Marker>
    );

    if (props.OnlyFavorites) {
      if (props.Favorites.includes(props.Name)) {
        return <View>{marker}</View>;
      }
    } else {
      return <View>{marker}</View>;
    }
  }
}

const styles = StyleSheet.create({
  markerCircle: {
    alignItems: "center",
  },
  markerPinText: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
  },
});

export default MapMarker;
