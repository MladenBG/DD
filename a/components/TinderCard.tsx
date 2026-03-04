import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  runOnJS 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

interface Props {
  user: any;
  isFirst: boolean;
  onSwipe: (dir: 'left' | 'right') => void;
}

const TinderCard: React.FC<Props> = ({ user, isFirst, onSwipe }) => {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .enabled(isFirst)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        translateX.value = withSpring(direction === 'right' ? 500 : -500);
        runOnJS(onSwipe)(direction);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-width / 2, 0, width / 2], [-10, 0, 10]) + 'deg';
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: rotate }
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, isFirst && animatedStyle]}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <View style={styles.footer}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width * 0.9,
    height: 450, // Fixed height for testing
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  image: { width: '100%', height: '100%', position: 'absolute' },
  footer: {
    position: 'absolute',
    bottom: 0,
    padding: 20,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  name: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  bio: { color: 'white', fontSize: 16 },
});

export default TinderCard;