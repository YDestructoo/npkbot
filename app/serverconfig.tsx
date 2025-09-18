import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ServerConfigScreen = () => {
  const [serverIP, setServerIP] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkIP = async () => {
      const savedIP = await AsyncStorage.getItem("server_ip");
      if (savedIP) {
        // If IP already saved, skip this screen
        router.replace("/screencontroller");
      } else {
        setLoading(false);
      }
    };
    checkIP();
  }, []);

  const saveIP = async () => {
    if (!serverIP.startsWith("http")) {
      Alert.alert("Invalid IP", "Please include http:// or https://");
      return;
    }
    await AsyncStorage.setItem("server_ip", serverIP);
    router.replace("/screencontroller"); // Load main app after saving
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Server IP</Text>
      <TextInput
        style={styles.input}
        placeholder="http://192.168.1.10:5000"
        value={serverIP}
        onChangeText={setServerIP}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={saveIP}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServerConfigScreen;
