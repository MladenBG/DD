import React from 'react';
import { View, TouchableOpacity, Image, Text, TextInput } from 'react-native';

export const HeaderSwipe = ({ 
  logoImg, isVip, setShowPaywall, tab, searchQuery, setSearchQuery, 
  setShowFilters, setTab, setDiscoveryMode, discoveryMode, setCurrentPage 
}: any) => {
  return (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity onPress={() => {setTab('discover'); setDiscoveryMode('list');}}>
          <Image source={logoImg} className="w-[140px] h-[60px]" resizeMode="contain" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`py-2 px-4 rounded-full ${isVip ? 'bg-yellow-400' : 'bg-green-500'}`} 
          onPress={() => setShowPaywall(true)}
        >
          <Text className="text-white text-[11px] font-bold">{isVip ? "💎 VIP MEMBER" : "⚡ GO PRO"}</Text>
        </TouchableOpacity>
      </View>

      {tab === 'discover' && (
        <>
          <View className="flex-row items-center">
            <TextInput 
              className="flex-1 h-[45px] bg-gray-100 rounded-xl px-4 text-black" 
              placeholder="Search Town, Name or Sexuality..." 
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(t) => { setSearchQuery(t); setCurrentPage(1); }}
              autoCorrect={false}
            />
            <TouchableOpacity className="ml-2.5 w-[45px] h-[45px] bg-gray-100 rounded-xl justify-center items-center" onPress={() => setShowFilters(true)}>
              <Text className="text-[18px]">🔍</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-4 bg-gray-100 rounded-lg p-1">
            {['list', 'swipe', 'radar'].map((m: any) => (
              <TouchableOpacity 
                key={m}
                className={`flex-1 py-2 items-center rounded-lg ${discoveryMode === m ? 'bg-white shadow-sm elevation-2' : ''}`} 
                onPress={() => (m === 'list' || isVip) ? setDiscoveryMode(m) : setShowPaywall(true)}
              >
                <Text className={`text-[10px] font-bold ${discoveryMode === m ? 'text-green-500' : 'text-gray-400'}`}>
                  {m.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};