import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SoilData {
  id: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  recommendation: string;
  timestamp: string;
}

const DataPredictionScreen = () => {
  const [data, setData] = useState<SoilData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ----- Recommendation Logic -----
  const getRecommendation = (n: number, p: number, k: number) => {
    let rec: string[] = [];
    if (n < 20) rec.push("Add Nitrogen-rich fertilizer (Urea)");
    if (p < 15) rec.push("Add Phosphorus-rich fertilizer (DAP)");
    if (k < 25) rec.push("Add Potassium-rich fertilizer (MOP)");
    return rec.length ? rec.join(". ") : "Soil is balanced. No fertilizer needed.";
  };

  // ----- Fetch Soil Data -----
  const fetchSoilData = async () => {
    try {
      setLoading(true);
      const baseURL = (await AsyncStorage.getItem("server_ip")) || "http://192.168.1.10:5000";
      const response = await fetch(`${baseURL}/soil`);
      if (!response.ok) throw new Error("Failed to fetch soil data");

      const soilData = await response.json();
      const formatted: SoilData = {
        id: Date.now().toString(),
        nitrogen: soilData.nitrogen,
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium,
        recommendation: getRecommendation(soilData.nitrogen, soilData.phosphorus, soilData.potassium),
        timestamp: new Date().toLocaleString(),
      };

      setData(prev => [formatted, ...prev]); // Prepend new scan data
    } catch (error) {
      console.error("Error fetching soil data:", error);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSoilData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSoilData();
  };

  // ----- Render Card -----
  const renderItem = ({ item }: { item: SoilData }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>📅 {item.timestamp}</Text>

      <View style={styles.dataRow}>
        <MaterialIcons name="grass" size={20} color="#2e86de" />
        <Text style={styles.dataLabel}>Nitrogen (N):</Text>
        <Text style={styles.dataValue}>{item.nitrogen} mg/kg</Text>
      </View>

      <View style={styles.dataRow}>
        <MaterialIcons name="local-florist" size={20} color="#27ae60" />
        <Text style={styles.dataLabel}>Phosphorus (P):</Text>
        <Text style={styles.dataValue}>{item.phosphorus} mg/kg</Text>
      </View>

      <View style={styles.dataRow}>
        <MaterialIcons name="eco" size={20} color="#f39c12" />
        <Text style={styles.dataLabel}>Potassium (K):</Text>
        <Text style={styles.dataValue}>{item.potassium} mg/kg</Text>
      </View>

      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationLabel}>Recommendation:</Text>
        <Text style={styles.recommendationText}>{item.recommendation}</Text>
      </View>
    </View>
  );

  // ----- Loading Screen -----
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Fetching soil data...</Text>
      </View>
    );
  }

  // ----- Main UI -----
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fertilizer Recommendations</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2e86de"]} />
          }
        />
      ) : (
        <Text style={styles.noDataText}>No soil data available. Please scan first.</Text>
      )}
    </View>
  );
};

export default DataPredictionScreen;

const styles = StyleSheet.create({
  // ----- Layout Containers -----
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  listContent: {
    paddingBottom: 20,
  },

  // ----- Titles & Text -----
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 20,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    color: "#636e72",
    marginTop: 20,
    fontSize: 16,
  },

  // ----- Loading -----
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#636e72",
  },

  // ----- Card Styling -----
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  timestamp: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    fontStyle: "italic",
    textAlign: "right",
  },

  // ----- Data Rows -----
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    flex: 1,
    marginLeft: 8,
  },
  dataValue: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500",
  },

  // ----- Recommendations -----
  recommendationContainer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#dfe6e9",
    paddingTop: 12,
  },
  recommendationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 15,
    color: "#636e72",
    lineHeight: 22,
  },
});
