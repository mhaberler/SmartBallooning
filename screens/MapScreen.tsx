// import React, {Component} from 'react';
// import {StyleSheet, View} from 'react-native';
// import MapLibreGL from '@maplibre/maplibre-react-native';

// // Will be null for most users (only Mapbox authenticates this way).
// // Required on Android. See Android installation notes.
// MapLibreGL.setAccessToken(null);

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   map: {
//     flex: 1,
//     alignSelf: 'stretch',
//   },
// });

// export default class MapScreen extends Component {
//   render() {
//     return (
//       <View style={styles.page}>
//         <MapLibreGL.MapView
//           style={styles.map}
//           logoEnabled={false}
//           styleURL="https://demotiles.maplibre.org/style.json"
//         />
//       </View>
//     );
//   }
// }



// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.


import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native';
import MapLibreGL, { MapView, RasterSource, Camera, locationManager, Location, UserLocation, } from '@maplibre/maplibre-react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import HeadingIndicator from '@maplibre/maplibre-react-native/javascript/components/HeadingIndicator';

MapLibreGL.setAccessToken(null);

const MapScreen = () => {
  const [location, setLocation] = React.useState<Location | null>(null);

  useEffect(() => {
    locationManager.getLastKnownLocation().then((location) => {
      setLocation(location);
      console.log('location', location);

    });
  }, [])

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

  };


  const lineCoordinates = [
    [15, 47], // Point A
    [12, 46], // Point B

  ];

  return (
    <View style={styles.page}>
      <MapView
        style={styles.map}
        logoEnabled={false}

        styleURL="https://api.maptiler.com/maps/openstreetmap/style.json?key=yRxU9pVJBWg9qynruk8Y"
      >
        <Camera zoomLevel={14} centerCoordinate={[location?.coords.longitude, location?.coords.latitude]} followUserLocation />
        <UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} androidRenderMode="normal" />
        <HeadingIndicator heading={120} />
        {/* <HeadingIndicator heading={location?.coords.heading} /> */}
        {/* <RasterSource tileUrlTemplates={["https://api.maptiler.com/tiles/jp-forest/{z}/{x}/{y}.png?key=8P7TgUWT5JtUUmMMgtga"]} /> */}

        {/* <MapLibreGL.RasterSource attribution='© OpenStreetMap contributors'
        id="osm"
        tileSize={256}
        tileUrlTemplates={["https://api.maptiler.com/tiles/satellite-mediumres-2018/{z}/{x}/{y}.jpg?key=8P7TgUWT5JtUUmMMgtga"]}>
        <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" /> 
      </MapLibreGL.RasterSource>*/}
        <MapLibreGL.ShapeSource
          id="lineSource"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: lineCoordinates,
            },
          }}
        >
          <MapLibreGL.LineLayer
            id="lineLayer"
            style={{ lineColor: 'red', lineWidth: 5 }}
          />
        </MapLibreGL.ShapeSource>
      </MapView>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});


