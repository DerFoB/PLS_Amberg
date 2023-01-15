import React from "react";
import { View, StyleSheet } from "react-native";

// Generates a mask which is put above the whole site
function PageMask(props) {
  return <View style={styles.page_mask} />;
}

const styles = StyleSheet.create({
  page_mask: {
    position: "absolute",
    left: 0,
    width: "100%",
    top: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default PageMask;
