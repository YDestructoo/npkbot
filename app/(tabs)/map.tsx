import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";

const MapScreen: React.FC = () => {
  const [serverIP, setServerIP] = useState<string | null>(null);
  const [botLocation, setBotLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showCoordinates, setShowCoordinates] = useState(true);

  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load Server IP on start
  useEffect(() => {
    const loadIP = async () => {
      const savedIP = await AsyncStorage.getItem("server_ip");
      if (savedIP) {
        setServerIP(savedIP);
      } else {
        Alert.alert("No Server IP", "Please set the server IP in settings first.");
      }
    };
    loadIP();
  }, []);

  // Pulse animation for marker
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Fetch GPS data every 3s
  useEffect(() => {
    if (!serverIP) return;

    const fetchGPS = async () => {
      try {
        const response = await fetch(`${serverIP}/gps`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        setBotLocation((current) => ({
          ...current,
          latitude: data.latitude,
          longitude: data.longitude,
        }));

        setIsOnline(true);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("GPS fetch error:", error);
        setIsOnline(false);
      }
    };

    fetchGPS();
    const interval = setInterval(fetchGPS, 3000);
    return () => clearInterval(interval);
  }, [serverIP]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude: botLocation.latitude, longitude: botLocation.longitude },
        zoom: 17,
      }, { duration: 1000 });
    }
  };

  const toggleCoordinates = () => setShowCoordinates(!showCoordinates);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: isOnline ? "#00C851" : "#ff4444" }]}>
        <MaterialIcons name={isOnline ? "wifi" : "wifi-off"} size={16} color="white" />
        <Text style={styles.statusText}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={botLocation}
        customMapStyle={mapStyle}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        <Circle
          center={botLocation}
          radius={10}
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeColor="rgba(0, 122, 255, 0.3)"
          strokeWidth={1}
        />
        <Marker coordinate={botLocation} anchor={{ x: 0.5, y: 0.5 }} flat={true}>
          <Animated.View style={[styles.markerContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.markerOuter}>
              <View style={styles.markerInner} />
            </View>
          </Animated.View>
        </Marker>
      </MapView>

      {/* Coordinates Panel */}
      {showCoordinates && (
        <View style={styles.coordinatesPanel}>
          <View style={styles.panelHeader}>
            <MaterialIcons name="gps-fixed" size={20} color="#007AFF" />
            <Text style={styles.panelTitle}>Bot Location</Text>
          </View>
          <Text style={styles.coordinateText}>Latitude: {botLocation.latitude.toFixed(6)}°</Text>
          <Text style={styles.coordinateText}>Longitude: {botLocation.longitude.toFixed(6)}°</Text>
          <Text style={styles.lastUpdateText}>Last update: {formatTime(lastUpdate)}</Text>
        </View>
      )}

      {/* Right Side Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.toggleButton]} onPress={toggleCoordinates}>
          <MaterialIcons
            name={showCoordinates ? "visibility-off" : "visibility"}
            size={22}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.recenterButton]} onPress={handleRecenter}>
          <MaterialIcons name="my-location" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Map Style
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { flex: 1 },
  statusBadge: {
    position: "absolute",
    top: 40,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    zIndex: 10,
    elevation: 5,
  },
  statusText: { color: "white", fontSize: 12, fontWeight: "bold", marginLeft: 5 },
  markerContainer: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  markerOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,122,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  markerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#007AFF" },
  coordinatesPanel: {
    position: "absolute",
    bottom: 30,
    left: 15,
    right: 15,
    backgroundColor: "rgba(26,26,26,0.95)",
    borderRadius: 14,
    padding: 14,
    elevation: 6,
  },
  panelHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  panelTitle: { color: "white", fontSize: 15, fontWeight: "600", marginLeft: 6 },
  coordinateText: { color: "white", fontSize: 13, marginBottom: 2 },
  lastUpdateText: { color: "#aaa", fontSize: 11, marginTop: 4 },
  buttonContainer: {
    position: "absolute",
    right: 15,
    bottom: 160,
    alignItems: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 5,
  },
  toggleButton: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
  recenterButton: { backgroundColor: "#007AFF" },
});

export default MapScreen;
