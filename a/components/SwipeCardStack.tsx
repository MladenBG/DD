import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import TinderCard from './TinderCard';

const { width } = Dimensions.get('window');

// Mock data for your testers
const DUMMY_USERS = [
  { id: '1', name: 'Alex', age: 24, bio: 'Video verified & ready to chat!', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500' },
  { id: '2', name: 'Jordan', age: 27, bio: 'Love hiking and outdoor video calls.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500' },
  { id: '3', name: 'Sam', age: 22, bio: 'Bisexual | Artist | Verified', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500' },
];

const SwipeCardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${DUMMY_USERS[currentIndex].name}`);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {DUMMY_USERS.map((user, index) => {
        // Only render the current card and the one behind it for performance
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null;

        return (
          <TinderCard 
            key={user.id} 
            user={user} 
            isFirst={index === currentIndex} 
            onSwipe={onSwipe} 
          />
        );
      }).reverse()} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default SwipeCardStack;