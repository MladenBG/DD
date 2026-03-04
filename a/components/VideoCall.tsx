import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
// Default import to bypass construct signature issues
// TO THIS:
import ZegoUIKitPrebuiltCallRaw from '@zegocloud/zego-uikit-prebuilt-call-rn';
// @ts-ignore
const ZegoUIKitPrebuiltCall = ZegoUIKitPrebuiltCallRaw.default || ZegoUIKitPrebuiltCallRaw;

// --- ZEGO CREDENTIALS ---
// REPLACE THESE WITH YOUR ACTUAL KEYS
const YOUR_APP_ID = 123456789; 
const YOUR_APP_SIGN = 'PASTE_YOUR_LONG_APPSIGN_STRING_HERE';

export const VideoCall = ({ route, navigation }: any) => {
  // Extract parameters from navigation or use defaults to prevent crash
  const { userID, userName, callID, chatUserName } = route?.params || {
    userID: 'user_' + Math.floor(Math.random() * 10000),
    userName: 'Guest',
    callID: 'default_room',
    chatUserName: 'Match'
  };

  return (
    <View style={styles.container}>
      {/* CUSTOM OVERLAY HEADER */}
      <View style={styles.header}>
        <View style={styles.liveIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.headerText}>
            Secure Date: {chatUserName || 'Match'}
          </Text>
        </View>
        <Text style={styles.brandText}>DateRoot E2E</Text>
      </View>

      {/* ZEGO VIDEO ENGINE */}
      {/* @ts-ignore: Bypasses JSX type mismatch between Zego and React 18 */}
      <ZegoUIKitPrebuiltCall
        appID={YOUR_APP_ID}
        appSign={YOUR_APP_SIGN}
        userID={String(userID)} 
        userName={String(userName)} 
        callID={String(callID)} 
        
        config={{
      // FIX: Manual config to replace the missing ONE_ON_ONE_VIDEO_CALL_CONFIG
          role: 1, 
          onHangUp: () => {
            navigation.goBack();
          },
          containerStyle: { flex: 1 },
          backgroundColor: '#000000',
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          useSpeakerWhenJoining: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  brandText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  }
});