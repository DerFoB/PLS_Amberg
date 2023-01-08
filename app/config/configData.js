export default {
  path: "http://parken.amberg.de/wp-content/uploads/pls/pls.xml", // path where to fetch PLS data

  storage: "@Data", // storage for Data for asynch storage
  favorites: "@Favorites", // storage for user favorites
  ttsSetting: "TTSSetting", // storage for setting
  favoritesSetting: "FavoritesSetting", // storage for setting
  lastShortestDistanceCarpark: "lastShortestDistanceCarpark", //last carpark which was closest to the user, so he doesnt get spammed if he moves around in the radius

  geofencingRadius: 500, // radius for geofencing in meters
};
