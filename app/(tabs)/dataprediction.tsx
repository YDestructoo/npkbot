// src/app/(tabs)/dataprediction.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const dummyData = [
  { id: '1', nitrogen: 15, phosphorus: 8, potassium: 12, recommendation: 'Apply a balanced NPK fertilizer.', timestamp: '2023-10-26' },
  { id: '2', nitrogen: 22, phosphorus: 10, potassium: 15, recommendation: 'Soil is rich in nitrogen. Use a low-N fertilizer.', timestamp: '2023-10-25' },
  { id: '3', nitrogen: 10, phosphorus: 5, potassium: 8, recommendation: 'Soil is deficient in all nutrients. Reapply fertilizer soon.', timestamp: '2023-10-24' },
];

const DataPredictionScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this is where you would fetch data from your
    // Flask backend running on the Raspberry Pi.
    // For this guide, we'll simulate fetching data with a delay.
    setTimeout(() => {
      setData(dummyData);
      setLoading(false);
    }, 2000); // Simulate a 2-second API call
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.timestamp}>{`Scan Date: ${item.timestamp}`}</Text>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Nitrogen (N):</Text>
        <Text style={styles.dataValue}>{item.nitrogen} mg/kg</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Phosphorus (P):</Text>
        <Text style={styles.dataValue}>{item.phosphorus} mg/kg</Text>
      </View>
      <View style={styles.dataRow}>
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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fertilizer Recommendations</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20, // Add horizontal padding for a better look
    paddingTop: 40, // Add more padding to the top for the title
  },
  title: {
    fontSize: 28, // Increase font size for emphasis
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25, // Increase space below the title
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15, // Slightly more rounded corners
    padding: 20,
    marginBottom: 20, // Add more space between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Increase shadow for a "lifted" look
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Increase space between data rows
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  dataValue: {
    fontSize: 16,
    color: '#333',
  },
  recommendationContainer: {
    marginTop: 15, // Increase space above the recommendation section
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  recommendationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
});

export default DataPredictionScreen;
