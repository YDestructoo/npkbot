import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

interface LiveCameraProps {
  serverIP: string;
  fullscreenMode?: boolean;
  onFullscreen?: () => void;
  onExit?: () => void;
  onSoilScan?: () => void;
  onCapture?: () => void;
  onMove?: (dir: string) => void;
}

const LiveCamera: React.FC<LiveCameraProps> = ({
  serverIP,
  fullscreenMode = false,
  onFullscreen,
  onExit,
  onSoilScan,
  onCapture,
  onMove,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const directions = [
    { label: "up", icon: "chevron-up-outline" },
    { label: "left", icon: "chevron-back-outline" },
    { label: "right", icon: "chevron-forward-outline" },
    { label: "down", icon: "chevron-down-outline" },
  ];

  return (
    <View style={[styles.wrapper, fullscreenMode && styles.fullscreen]}>
      {/* Video Feed */}
      <View style={fullscreenMode ? styles.landscapeVideo : { flex: 1 }}>
        {loading && !error && <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />}
        <WebView
          source={{ uri: `${serverIP}/video_feed` }}
          style={styles.cameraView}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
        {error && (
          <View style={styles.noSignalContainer}>
            <Text style={styles.noSignalText}>No Signal</Text>
          </View>
        )}

        {!fullscreenMode && (
          <TouchableOpacity style={styles.fullscreenButton} onPress={onFullscreen}>
            <Ionicons name="scan-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {fullscreenMode && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onCapture}>
            <Ionicons name="camera-outline" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.dPad}>
            {directions.map((dir) => (
              <TouchableOpacity key={dir.label} style={styles.dPadButton} onPress={() => onMove?.(dir.label)}>
                <Ionicons name={dir.icon as any} size={20} color="#000" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.soilButton} onPress={onSoilScan}>
            <Text style={styles.soilButtonText}>Start Soil Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton} onPress={onExit}>
            <Ionicons name="close-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LiveCamera;

const styles = StyleSheet.create({
  wrapper: {
    margin: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: 250,
    position: "relative",
  },
  fullscreen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#000",
    margin: 0,
    borderRadius: 0,
  },
  landscapeVideo: {
    flex: 2,
    backgroundColor: "#0f172a",
  },
  cameraView: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 10,
  },
  dPad: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  dPadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  fullscreenButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 6,
  },
  iconButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
  },
  soilButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  soilButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  exitButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    marginTop: 20,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 1,
  },
  noSignalContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  noSignalText: {
    color: "red",
    fontSize: 18,
    fontWeight: "700",
  },
});
