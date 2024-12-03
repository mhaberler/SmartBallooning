import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native';
import MapLibreGL, { MapView, RasterSource, Camera, locationManager, Location, UserLocation, } from '@maplibre/maplibre-react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import HeadingIndicator from '@maplibre/maplibre-react-native/javascript/components/HeadingIndicator';
import { LocationProvider, useLocation } from '../contexts/LocationContext';


MapLibreGL.setAccessToken(null);

const MapDisplay = () => {
  const { location } = useLocation();

  const lineCoordinates = [
    [15, 47], // Point A
    [12, 46], // Point B

  ];
  const rasterSourceProps = {
    id: 'stamenWatercolorSource',
    tileUrlTemplates: [
      // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      'http://a.tile.osm.org/{z}/{x}/{y}.png'
      // 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    ],
    tileSize: 256,
  };

  return (
    true ?
      (
        <View style={styles.page}>
          <MapLibreGL.MapView
            style={styles.map}
            rotateEnabled={false}

          >
            <MapLibreGL.Camera
              zoomLevel={8}
              centerCoordinate={ [15, 47]}
            />
            <UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} androidRenderMode="compass" />
            {/* <HeadingIndicator heading={270} /> */}
            <MapLibreGL.RasterSource {...rasterSourceProps}>
              <MapLibreGL.RasterLayer
                id="stamenWatercolorLayer"
                sourceID="stamenWatercolorSource"
              // style={{ rasterOpacity: this.state.opacity }}
              />
            </MapLibreGL.RasterSource>
          </MapLibreGL.MapView>
        </View>
      )
      :
      <View style={styles.page}>
        <MapView
          style={styles.map}
          logoEnabled={false}
          styleURL="https://api.maptiler.com/maps/openstreetmap/style.json?key=yRxU9pVJBWg9qynruk8Y"
        >
          <Camera zoomLevel={12} centerCoordinate={[location?.coords.longitude, location?.coords.latitude]} followUserLocation />
          <UserLocation visible={true} animated={true} showsUserHeadingIndicator={true} androidRenderMode="compass" />
          {/* <HeadingIndicator heading={270} /> */}
          {/* <HeadingIndicator heading={location?.coords.heading ? location.coords.heading : null} /> */}
          {/* <RasterSource tileUrlTemplates={["https://api.maptiler.com/tiles/jp-forest/{z}/{x}/{y}.png?key=8P7TgUWT5JtUUmMMgtga"]} /> */}

          {/* <MapLibreGL.RasterSource attribution='© OpenStreetMap contributors'
        id="osm"
        tileSize={256}
        tileUrlTemplates={["https://api.maptiler.com/tiles/satellite-mediumres-2018/{z}/{x}/{y}.jpg?key=8P7TgUWT5JtUUmMMgtga"]}>
        <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" /> 
      </MapLibreGL.RasterSource>*/}

          {/* <MapLibreGL.ShapeSource
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
        </MapLibreGL.ShapeSource> */}
        </MapView>

      </View>
  )
}

const MapScreen = () => {
  return (
    <LocationProvider >
      <MapDisplay />
    </LocationProvider>
  );
};

export default MapScreen;

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


