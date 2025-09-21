import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LiveCamera from "../../components/LiveCamera";

export default function ScreenController() {
  const [serverIP, setServerIP] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isProbeScanning, setIsProbeScanning] = useState(false);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const router = useRouter();

  // Load IP on start
  useEffect(() => {
    const loadIP = async () => {
      const savedIP = await AsyncStorage.getItem("server_ip");
      if (savedIP) {
        setServerIP(savedIP);
        setIpInput(savedIP);
      } else {
        Alert.alert("No Server IP", "Please set the server IP first.");
      }
    };
    loadIP();
  }, []);

  // Save new IP
  const saveIP = async () => {
    if (!ipInput.startsWith("http")) {
      Alert.alert("Invalid IP", "Please include http:// or https://");
      return;
    }
    await AsyncStorage.setItem("server_ip", ipInput);
    setServerIP(ipInput);
    setIsEditing(false);
    Alert.alert("Success", "Server IP updated successfully!");
  };

  // Send command to bot
  const sendCommand = async (command: string) => {
    if (!serverIP) {
      Alert.alert("Error", "Server IP not configured");
      return;
    }

    try {
      const response = await fetch(`${serverIP}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      console.log("Command sent:", command);
    } catch (err) {
      console.error("API Error:", err);
      Alert.alert("Connection Error", "Check your server IP or network.");
    }
  };

  const handleCommand = async (cmd: string) => {
    if (isSending) return;
    setIsSending(true);
    await sendCommand(cmd);
    setTimeout(() => setIsSending(false), 300);
  };

  const handleDirectionPress = (dir: string, cmd: string) => {
    setActiveDirection(dir);
    handleCommand(cmd);
  };

  const handleDirectionRelease = () => {
    setActiveDirection(null);
    handleCommand("stop");
  };

  const handleProbeScan = async () => {
    setIsProbeScanning(true);
    await handleCommand("scan_soil");
    setTimeout(() => setIsProbeScanning(false), 3000);
  };

  // D-Pad Config
  const dPadButtons = [
    { label: "↑", cmd: "forward", direction: "up", style: styles.dPadButtonTop },
    { label: "↓", cmd: "backward", direction: "down", style: styles.dPadButtonBottom },
    { label: "←", cmd: "left", direction: "left", style: styles.dPadButtonLeft },
    { label: "→", cmd: "right", direction: "right", style: styles.dPadButtonRight },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Robot Controller</Text>

        {/* Edit Button */}
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons name="settings" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Edit IP Box */}
      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Server IP (http://...)"
            value={ipInput}
            onChangeText={setIpInput}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveIP}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>Server: {serverIP || "Not Configured"}</Text>
        <Text style={styles.statusBarText}>
          Status: {isSending ? "Sending..." : "Ready"}
        </Text>
      </View>

      {/* Camera Feed with Fullscreen */}
      {serverIP && (
        <LiveCamera
          serverIP={serverIP}
          onFullscreen={() => router.push({ pathname: "../fullscreen-camera" as const, params: { serverIP } })}

          onMove={(dir) => {
            if (dir === "stop") {
              handleDirectionRelease();
            } else {
              const commandMap: Record<string, string> = {
                up: "forward",
                down: "backward",
                left: "left",
                right: "right",
              };
              handleDirectionPress(dir, commandMap[dir]);
            }
          }}
          onSoilScan={handleProbeScan}
          onCapture={() => Alert.alert("Picture", "Capture feature coming soon")}
        />
      )}

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {/* D-Pad */}
        <View style={styles.controlCard}>
          <Text style={styles.cardTitle}>Movement Controls</Text>
          <View style={styles.dPad}>
            {dPadButtons.map((btn, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dPadButton,
                  btn.style,
                  activeDirection === btn.direction && styles.dPadButtonActive,
                ]}
                onPressIn={() => handleDirectionPress(btn.direction, btn.cmd)}
                onPressOut={handleDirectionRelease}
                disabled={isSending && activeDirection !== btn.direction}
              >
                <Text style={styles.dPadText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.dPadCenter} />
          </View>
        </View>

        {/* Soil Scan */}
        <View style={styles.controlCard}>
          <Text style={styles.cardTitle}>Soil Analysis</Text>
          <TouchableOpacity
            style={[
              styles.soilScanButton,
              isProbeScanning && styles.soilScanButtonActive,
            ]}
            onPress={handleProbeScan}
            disabled={isProbeScanning}
          >
            <Text style={styles.soilScanButtonText}>
              {isProbeScanning ? "Scanning..." : "Start Soil Scan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1e293b" },
  editContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: "#f1f5f9",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  statusBar: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  statusBarText: { fontSize: 14, color: "#475569", fontWeight: "500" },
  controlPanel: { flex: 1, padding: 20, gap: 16 },
  controlCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginBottom: 20 },
  dPad: {
    width: 200,
    height: 200,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dPadButton: {
    backgroundColor: "#3b82f6",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 24,
  },
  dPadButtonActive: { backgroundColor: "#1d4ed8", transform: [{ scale: 1.1 }] },
  dPadButtonTop: { top: 20 },
  dPadButtonBottom: { bottom: 20 },
  dPadButtonLeft: { left: 20 },
  dPadButtonRight: { right: 20 },
  dPadCenter: { width: 48, height: 48, backgroundColor: "#e2e8f0", borderRadius: 6 },
  dPadText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  soilScanButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  soilScanButtonActive: { backgroundColor: "#f59e0b" },
  soilScanButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
