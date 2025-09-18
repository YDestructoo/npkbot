import React, { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
// Change this to your RPi IP when deployed
const RPI_API_URL = 'https://ydestructooo.pythonanywhere.com';

// ===== Reusable API Request =====
const sendCommand = async (command: string) => {
  try {
    const response = await fetch(`${RPI_API_URL}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Command Sent:', command, 'Response:', data);
  } catch (err) {
    console.error('❌ API Error:', err);
    Alert.alert('Connection Error', 'Could not connect to the bot. Check server IP & network.');
  }
};

export default function ScreenController() {
  const [isProbeScanning, setIsProbeScanning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);

  // Prevent spammy requests
  const handleCommand = async (cmd: string) => {
    if (isSending) return;
    setIsSending(true);
    await sendCommand(cmd);
    setTimeout(() => setIsSending(false), 300);
  };

  // Direction handlers with visual feedback
  const handleDirectionPress = (direction: string, cmd: string) => {
    setActiveDirection(direction);
    handleCommand(cmd);
  };

  const handleDirectionRelease = () => {
    setActiveDirection(null);
    handleCommand('stop');
  };

  // Soil Scan Logic
  const handleProbeScan = async () => {
    setIsProbeScanning(true);
    await handleCommand('scan_soil');
    setTimeout(() => setIsProbeScanning(false), 3000);
  };

  // D-Pad Config → keeps buttons dynamic
  const dPadButtons = [
    { label: '↑', cmd: 'forward', direction: 'up', style: styles.dPadButtonTop },
    { label: '↓', cmd: 'backward', direction: 'down', style: styles.dPadButtonBottom },
    { label: '←', cmd: 'left', direction: 'left', style: styles.dPadButtonLeft },
    { label: '→', cmd: 'right', direction: 'right', style: styles.dPadButtonRight },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Robot Controller</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Connected</Text>
        </View>
      </View>

      {/* Camera Feed */}
      <View style={styles.cameraCard}>
        <View style={styles.cameraFeedContainer}>
          <Text style={styles.cameraFeedText}>Live Camera Feed</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {/* Movement Controls Card */}
        <View style={styles.controlCard}>
          <Text style={styles.cardTitle}>Movement Controls</Text>
          
          {/* D-Pad */}
          <View style={styles.dPad}>
            {dPadButtons.map((btn, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dPadButton, 
                  btn.style,
                  activeDirection === btn.direction && styles.dPadButtonActive
                ]}
                onPressIn={() => handleDirectionPress(btn.direction, btn.cmd)}
                onPressOut={handleDirectionRelease}
                disabled={isSending && activeDirection !== btn.direction}
              >
                <Text style={[
                  styles.dPadText,
                  activeDirection === btn.direction && styles.dPadTextActive
                ]}>
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.dPadCenter} />
          </View>
        </View>

        {/* Soil Scan Card */}
        <View style={styles.controlCard}>
          <Text style={styles.cardTitle}>Soil Analysis</Text>
          
          <View style={styles.soilScanContainer}>
            <TouchableOpacity
              style={[
                styles.soilScanButton,
                isProbeScanning && styles.soilScanButtonActive
              ]}
              onPress={handleProbeScan}
              disabled={isProbeScanning}
            >
              <Text style={styles.soilScanButtonText}>
                {isProbeScanning ? 'Scanning...' : 'Start Soil Scan'}
              </Text>
              {isProbeScanning && <View style={styles.scanningIndicator} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>
          Status: {isSending ? 'Sending command...' : 'Ready'}
        </Text>
        <Text style={styles.statusBarText}>Server: Connected</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ===== Main Container =====
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // ===== Header =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // ===== Camera Feed =====
  cameraCard: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraFeedContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  cameraFeedText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '500',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ===== Control Panel =====
  controlPanel: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  controlCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },

  // ===== D-Pad =====
  dPad: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dPadButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  dPadButtonActive: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
  },
  dPadButtonTop: { top: 20 },
  dPadButtonBottom: { bottom: 20 },
  dPadButtonLeft: { left: 20 },
  dPadButtonRight: { right: 20 },
  dPadCenter: {
    width: 48,
    height: 48,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  dPadText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  dPadTextActive: {
    color: '#ffffff',
  },

  // ===== Soil Scan =====
  soilScanContainer: {
    alignItems: 'center',
  },
  soilScanButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soilScanButtonActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
    shadowColor: '#f59e0b',
  },
  soilScanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanningIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
    // Note: React Native doesn't support CSS animations, you'd need to use Animated API for rotation
  },

  // ===== Status Bar =====
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  statusBarText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});