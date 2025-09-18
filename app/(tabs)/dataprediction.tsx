import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const RPI_API_URL = "https://ydestructooo.pythonanywhere.com";

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

  const getRecommendation = (nitrogen: number, phosphorus: number, potassium: number) => {
    let rec: string[] = [];
    if (nitrogen < 20) rec.push("Add Nitrogen-rich fertilizer (e.g., Urea)");
    if (phosphorus < 15) rec.push("Add Phosphorus-rich fertilizer (e.g., DAP)");
    if (potassium < 25) rec.push("Add Potassium-rich fertilizer (e.g., MOP)");
    return rec.length === 0 ? "Soil is balanced. No fertilizer needed." : rec.join(". ");
  };

  const fetchSoilData = async () => {
    try {
      const response = await fetch(`${RPI_API_URL}/soil`);
      if (!response.ok) throw new Error("No soil data available");

      const soilData = await response.json();
      const formattedData: SoilData[] = [
        {
          id: "1",
          nitrogen: soilData.nitrogen,
          phosphorus: soilData.phosphorus,
          potassium: soilData.potassium,
          recommendation: getRecommendation(
            soilData.nitrogen,
            soilData.phosphorus,
            soilData.potassium
          ),
          timestamp: new Date().toLocaleString(),
        },
      ];
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching soil data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilData();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Fetching soil data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fertilizer Recommendations</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noDataText}>No soil data available. Please scan first.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 20,
    textAlign: "center",
  },
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
  noDataText: {
    textAlign: "center",
    color: "#636e72",
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
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

export default DataPredictionScreen;
