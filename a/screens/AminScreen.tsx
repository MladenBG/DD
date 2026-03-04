// screens/AdminScreen.tsx
import React from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const AdminScreen = ({ profiles, adminSearch, setAdminSearch, onToggleBan }: any) => {
  const filtered = profiles.filter((p: any) => p.name.toLowerCase().includes(adminSearch.toLowerCase()));

  return (
    <View style={{flex: 1}}>
      <View style={styles.adminHeader}>
        <Text style={styles.title}>Dateroot Admin Portal</Text>
        <TextInput 
          style={styles.adminInput} 
          placeholder="Search user ID or Name..." 
          value={adminSearch}
          onChangeText={setAdminSearch}
        />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNum}>{profiles.length}</Text><Text style={styles.label}>Users</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>{profiles.filter((p:any)=>p.isBanned).length}</Text><Text style={styles.label}>Banned</Text></View>
        </View>
        {filtered.slice(0, 50).map((u: any) => (
          <View key={u.id} style={styles.adminRow}>
            <Image source={{uri: u.image}} style={styles.adminAvatar} />
            <View style={{flex: 1}}>
              <Text style={[styles.darkText, u.isBanned && {color: 'red'}]}>{u.name}</Text>
              <Text style={{fontSize: 12, color: '#999'}}>{u.town}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => onToggleBan(u.id)}
              style={[styles.banBtn, {backgroundColor: u.isBanned ? '#4CAF50' : '#FF3B30'}]}>
              <Text style={styles.btnTextSmall}>{u.isBanned ? 'Unban' : 'Ban'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  adminHeader: { padding: 10, backgroundColor: '#F9F9F9', borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 15, color: '#333' },
  adminInput: { height: 45, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#DDD', marginHorizontal: 15, marginBottom: 10 },
  adminRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  adminAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
  statsRow: { flexDirection: 'row', padding: 15, justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  label: { fontSize: 12, color: '#999' },
  darkText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  banBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnTextSmall: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});