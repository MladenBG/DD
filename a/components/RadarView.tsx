import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate,
  Extrapolation 
} from 'react-native-reanimated';

const PulseCircle = ({ delay = 0 }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000 }), 
      -1, // Loop forever
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulse.value, [0, 0.5, 1], [0.6, 0.3, 0]),
      transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 4]) }]
    };
  });

  return <Animated.View style={[styles.pulse, animatedStyle]} />;
};

const RadarView: React.FC = () => {
  return (
    <View style={styles.container}>
      <PulseCircle />
      <PulseCircle delay={1000} />
      
      {/* Center User Icon */}
      <View style={styles.centerDot}>
        <Text style={{ fontSize: 30 }}>📍</Text>
      </View>

      <Text style={styles.statusText}>Searching for nearby matches...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF4B6E',
  },
  centerDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  statusText: { color: '#888', marginTop: 150, fontWeight: '500' }
});

export default RadarView;