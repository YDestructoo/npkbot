
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapScreen = () => {
  const [botLocation, setBotLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a small, random movement for the bot.
      setBotLocation(currentLocation => ({
        ...currentLocation,
        latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.0005,
        longitude: currentLocation.longitude + (Math.random() - 0.5) * 0.0005,
      }));
    }, 3000); // Updates every 3 seconds

    // Clean up the interval when the component unmounts to prevent memory leaks.
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures this runs only once on mount.

  return (
    // The main container for the map.
    <View style={styles.container}>
      {/* MapView is the primary component for displaying the map.
        - provider={PROVIDER_GOOGLE} is recommended for a consistent look and feel on Android.
        - initialRegion sets the initial visible area of the map.
        - style makes the map fill the entire screen.
      */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={botLocation}
      >
        {/* The Marker component displays a pin on the map.
          - coordinate specifies its exact GPS location.
          - title provides a label when the user taps on the pin.
          - description provides a subtitle for the pin.
        */}
        <Marker
          coordinate={{
            latitude: botLocation.latitude,
            longitude: botLocation.longitude,
          }}
          title="NPK-BOT Location"
          description={`Lat: ${botLocation.latitude.toFixed(4)}, Lon: ${botLocation.longitude.toFixed(4)}`}
        />
      </MapView>

      {/* This View acts as an overlay to display the current coordinates.
        This is useful for debugging and can be removed later.
      */}
      <View style={styles.coordinatesOverlay}>
        <Text style={styles.overlayText}>
          Bot Location:
        </Text>
        <Text style={styles.overlayText}>
          Lat: {botLocation.latitude.toFixed(5)}
        </Text>
        <Text style={styles.overlayText}>
          Lon: {botLocation.longitude.toFixed(5)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Makes the container fill the parent View.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Makes the map fill the container.
  },
  coordinatesOverlay: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapScreen;
