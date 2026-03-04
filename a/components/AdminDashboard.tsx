import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';

export const AdminDashboard = ({ profiles, setProfiles, isVip }: any) => {
  const [adminSearch, setAdminSearch] = useState('');

  const adminFiltered = profiles.filter((p: any) => 
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
    p.id.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const totalUsers = profiles.length;
  const bannedUsers = profiles.filter((p: any) => p.isBanned).length;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-5 bg-white border-b border-gray-200 shadow-sm elevation-2 z-10">
        <Text className="text-[28px] font-black tracking-tight text-gray-900 mb-1">
          DateRoot <Text className="text-green-500">ADMIN</Text>
        </Text>
        <Text className="text-[12px] font-bold text-gray-400 mb-4">Mobile Command Center</Text>
        
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-[45px] border border-gray-200">
          <Text className="text-[16px] mr-2">🔍</Text>
          <TextInput 
            className="flex-1 text-black font-semibold"
            placeholder="Search user ID or Name..." 
            placeholderTextColor="#999"
            value={adminSearch}
            onChangeText={setAdminSearch}
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row p-4 justify-between">
          <View className="flex-1 bg-white p-4 rounded-2xl mr-2 border border-gray-200 shadow-sm elevation-1 items-center">
            <Text className="text-[24px] font-black text-gray-900">{totalUsers}</Text>
            <Text className="text-[10px] font-bold text-gray-400 uppercase mt-1">Total Users</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-2xl mx-1 border border-gray-200 shadow-sm elevation-1 items-center border-b-4 border-b-red-500">
            <Text className="text-[24px] font-black text-gray-900">{bannedUsers}</Text>
            <Text className="text-[10px] font-bold text-gray-400 uppercase mt-1">Banned</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-2xl ml-2 border border-gray-200 shadow-sm elevation-1 items-center border-b-4 border-b-green-500">
            <Text className="text-[24px] font-black text-green-500">{isVip ? 'LIVE' : 'OFF'}</Text>
            <Text className="text-[10px] font-bold text-gray-400 uppercase mt-1">Server</Text>
          </View>
        </View>

        <Text className="px-5 py-2 text-[14px] font-bold text-gray-800 uppercase tracking-wider">
          User Database ({adminFiltered.length})
        </Text>

        <View className="bg-white border-y border-gray-200">
          {adminFiltered.map((u: any, index: number) => (
            <View key={u.id} className={`flex-row p-4 items-center ${index !== adminFiltered.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <Image source={{uri: u.image}} className="w-[50px] h-[50px] rounded-full mr-4 bg-gray-200" />
              <View className="flex-1">
                <Text className={`font-black text-[16px] ${u.isBanned ? 'text-red-500 line-through' : 'text-gray-900'}`}>{u.name}, {u.age}</Text>
                <Text className="text-[12px] font-semibold text-gray-500 mt-0.5">{u.town} • {u.gender}</Text>
                <Text className="text-[10px] font-mono text-gray-400 mt-1">ID: {u.id}</Text>
              </View>
              <TouchableOpacity onPress={() => setProfiles((prev: any) => prev.map((p: any) => p.id === u.id ? {...p, isBanned: !p.isBanned} : p))} className={`py-2 px-5 rounded-full shadow-sm elevation-1 ${u.isBanned ? 'bg-green-500' : 'bg-red-500'}`}>
                <Text className="text-white text-[12px] font-black tracking-wider">{u.isBanned ? 'UNBAN' : 'BAN'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};