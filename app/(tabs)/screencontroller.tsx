import { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Get the screen dimensions to create a responsive layout
const { width } = Dimensions.get('window');

// This is a placeholder for your Raspberry Pi's IP address and port.
// You will need to change this once your backend is running.
const RPI_API_URL = 'http://YOUR_RPI_IP_ADDRESS:5000/api';

// This function will handle sending commands to the bot.
// It's a placeholder for now, but shows how you would use the fetch API.
const sendCommand = async (command: string) => {
  console.log(`Sending command: ${command}`);
  try {
    // We use a simple fetch call to send the command to the API endpoint.
    // In a real scenario, you would send more data like speed or duration.
    const response = await fetch(`${RPI_API_URL}/control/${command}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Use Alert to show a simple error message to the user
      Alert.alert('Error', `Failed to send command. Status: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log('API response:', data);

  } catch (error) {
    console.error('Error sending command to API:', error);
    Alert.alert('Error', 'Could not connect to the bot. Please check the IP address.');
  }
};

export default function ScreenController() {
  const [isProbeScanning, setIsProbeScanning] = useState(false);

  const handleProbeScan = () => {
    setIsProbeScanning(true);
    console.log('Initiating soil scan...');
    // In a real scenario, you would send a command to the bot to trigger the NPK probe.
    sendCommand('scan_soil');
    // For now, we simulate the scan with a timer
    setTimeout(() => {
      console.log('Soil scan complete.');
      setIsProbeScanning(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera Feed Placeholder */}
      <View style={styles.cameraFeedContainer}>
        <Text style={styles.cameraFeedText}>
          Live Camera Feed Placeholder
        </Text>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {/* Directional Pad */}
        <View style={styles.dPad}>
          {/* Top Button */}
          <TouchableOpacity
            style={[styles.dPadButton, styles.dPadButtonTop]}
            onPressIn={() => sendCommand('forward')}
            onPressOut={() => sendCommand('stop')}
          >
            <Text style={styles.dPadText}>▲</Text>
          </TouchableOpacity>
          {/* Bottom Button */}
          <TouchableOpacity
            style={[styles.dPadButton, styles.dPadButtonBottom]}
            onPressIn={() => sendCommand('backward')}
            onPressOut={() => sendCommand('stop')}
          >
            <Text style={styles.dPadText}>▼</Text>
          </TouchableOpacity>
          {/* Left Button */}
          <TouchableOpacity
            style={[styles.dPadButton, styles.dPadButtonLeft]}
            onPressIn={() => sendCommand('left')}
            onPressOut={() => sendCommand('stop')}
          >
            <Text style={styles.dPadText}>◀︎</Text>
          </TouchableOpacity>
          {/* Right Button */}
          <TouchableOpacity
            style={[styles.dPadButton, styles.dPadButtonRight]}
            onPressIn={() => sendCommand('right')}
            onPressOut={() => sendCommand('stop')}
          >
            <Text style={styles.dPadText}>▶︎</Text>
          </TouchableOpacity>
          {/* Center Square */}
          <View style={styles.dPadCenterSquare} />
        </View>

        {/* Sensor Probe Button */}
        <View style={styles.probeButtonContainer}>
          <TouchableOpacity
            style={[styles.probeButton, isProbeScanning && styles.probeButtonScanning]}
            onPress={handleProbeScan}
            disabled={isProbeScanning}
          >
            <Text style={styles.probeButtonText}>
              {isProbeScanning ? 'Scanning...' : 'Start Soil Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center', // <-- We're setting this back to center
    padding: 20,
    marginTop: -60,
  },
  cameraFeedContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 50, // <-- Increase this value to push the controls down
    overflow: 'hidden',
  },
  cameraFeedText: {
    color: '#fff',
    fontSize: 18,
  },
  controlPanel: {
    width: '100%',
    alignItems: 'center',
  },
  dPad: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dPadButton: {
    backgroundColor: '#2e86de',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  dPadButtonTop: {
    top: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dPadButtonBottom: {
    bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  dPadButtonLeft: {
    left: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  dPadButtonRight: {
    right: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  dPadCenterSquare: {
    width: 60,
    height: 60,
    backgroundColor: '#2e86de',
  },
  dPadText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  probeButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  probeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  probeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  probeButtonScanning: {
    backgroundColor: '#FFC107',
  },
});
