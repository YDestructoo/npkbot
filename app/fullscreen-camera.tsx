import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import LiveCamera from "../components/LiveCamera";

export default function FullscreenCamera() {
  const router = useRouter();
  const { serverIP } = useLocalSearchParams<{ serverIP: string }>();
  

  // ✅ Command mapping same as main screen
  const commandMap: Record<string, string> = {
    up: "forward",
    down: "backward",
    left: "left",
    right: "right",
  };

  // ✅ Lock orientation to landscape when entering fullscreen
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // ✅ Send command to Flask server
  const sendCommand = async (command: string) => {
    if (!serverIP) {
      Alert.alert("Error", "Server IP not configured");
      return;
    }

    try {
      await fetch(`${serverIP}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      console.log("Command sent:", command);
    } catch (err) {
      console.error("Error sending command:", err);
    }
  };

  // ✅ Movement handler
  const handleMove = (dir: string) => {
    const command = commandMap[dir] || "stop";
    sendCommand(command);
  };

  // ✅ Soil scan handler
  const handleSoilScan = () => {
    sendCommand("scan_soil");
  };

  // ✅ Capture handler
  const handleCapture = () => {
    console.log("Capture Photo"); // you can add photo logic later
  };

  // ✅ Exit fullscreen, send stop command
  const handleExit = () => {
    sendCommand("stop");
    router.back();
  };

  return (
    <View style={styles.container}>
      <LiveCamera
        serverIP={serverIP || ""}
        fullscreenMode
        onExit={handleExit}
        onSoilScan={handleSoilScan}
        onCapture={handleCapture}
        onMove={handleMove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
