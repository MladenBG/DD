import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const SwipeButton = ({ completeSwipe }: any) => {
  return (
    <View className="flex-row absolute bottom-8">
      <TouchableOpacity 
        className="w-[70px] h-[70px] rounded-full bg-white justify-center items-center mr-5 shadow-lg elevation-5" 
        onPress={() => completeSwipe('left')}
      >
        <Text className="text-[30px]">✕</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-[70px] h-[70px] rounded-full bg-white justify-center items-center ml-5 shadow-lg elevation-5" 
        onPress={() => completeSwipe('right')}
      >
        <Text className="text-[30px]">❤️</Text>
      </TouchableOpacity>
    </View>
  );
};