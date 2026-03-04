import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import SwipeCardStack from '../components/SwipeCardStack'; 
import RadarView from '../components/RadarView';

// Define the two modes for TypeScript
type DiscoveryMode = 'manual' | 'auto';

const HomeScreen: React.FC = () => {
  const [mode, setMode] = useState<DiscoveryMode>('manual');

  return (
    <SafeAreaView style={styles.container}>
      {/* MODE SWITCHER AT THE TOP */}
      <View style={styles.header}>
        <View style={styles.switcherContainer}>
          <TouchableOpacity 
            style={[styles.tab, mode === 'manual' && styles.activeTab]}
            onPress={() => setMode('manual')}
          >
            <Text style={[styles.tabText, mode === 'manual' && styles.activeText]}>Manual</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, mode === 'auto' && styles.activeTab]}
            onPress={() => setMode('auto')}
          >
            <Text style={[styles.tabText, mode === 'auto' && styles.activeText]}>Auto Radar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT AREA */}
      <View style={styles.content}>
        {mode === 'manual' ? (
          <SwipeCardStack />  
        ) : (
          <RadarView />       
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, // Dark theme looks better for Radar
  header: { paddingVertical: 20, alignItems: 'center' },
  switcherContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#333', 
    borderRadius: 25, 
    padding: 4 
  },
  tab: { 
    paddingVertical: 10, 
    paddingHorizontal: 25, 
    borderRadius: 21 
  },
  activeTab: { backgroundColor: '#FF4B6E' }, // DateRoot Brand Pink
  tabText: { color: '#888', fontWeight: 'bold' },
  activeText: { color: '#FFF' },
  content: { flex: 1 }
});

export default HomeScreen;