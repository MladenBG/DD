import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  FlatList, 
  Image, 
  Alert, 
  ScrollView, 
  StatusBar, 
  Animated, 
  PanResponder 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import io from 'socket.io-client';

// IMPORTING FULL DATA AND COMPONENTS
import { 
  ALL_PROFILES, 
  width, 
  USERS_PER_PAGE, 
  NAMES, 
  GHOST_STICKERS, 
  SEXUALITIES 
} from './constants/profilesData';
import { UserCard } from './components/UserCard';
import { AllModals } from './components/Modals';

// IMPORTING SEPARATED COMPONENTS
import { Lobby } from './components/Lobby';
import { HeaderSwipe } from './components/HeaderSwipe';
import { SwipeButton } from './components/SwipeButton';
import { Subscription } from './components/Subscription';
import { EditProfile } from './components/EditProfile';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VideoCall } from './components/VideoCall';
// This allows the app to actually use the provider
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
const logoImg = require('./assets/logo.png');
const socket = io("http://localhost:3000");
const Stack = createStackNavigator();

// 1. Create the remote control (Ref)
export const navigationRef = createNavigationContainerRef();

export default function App() {
  // --- STATE MANAGEMENT ---
  const [tab, setTab] = useState<'discover' | 'lobby' | 'favorites' | 'admin' | 'settings'>('discover');
  const [discoveryMode, setDiscoveryMode] = useState<'list' | 'swipe' | 'radar'>('list');

  const [showPaywall, setShowPaywall] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // THE CRITICAL SECURITY TOGGLE: Change this to 'false' to hide the Mod tab from regular users!
  const [isAdmin, setIsAdmin] = useState(true); 
  
  const [isVip, setIsVip] = useState(false);
  const [profiles, setProfiles] = useState(ALL_PROFILES);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterSexuality, setFilterSexuality] = useState('All');
  
  const [adminSearch, setAdminSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [chatInput, setChatInput] = useState('');

  // --- SWIPE STATE ---
  const [swipeIndex, setSwipeIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  // --- LOBBY STATE ---
  const [lobbyMessages, setLobbyMessages] = useState([
    { id: '1', user: 'Luka 9', text: 'Hey from Budva!', time: '12:00' },
    { id: '2', user: 'Emma 2', text: 'Anyone in Miami?', time: '12:05' },
    { id: '3', user: 'System', text: 'Welcome to Dateroot Global.', time: '12:10' },
  ]);
  const [lobbyInput, setLobbyInput] = useState('');

  // --- SETTINGS STATE ---
  const [myName, setMyName] = useState('New User');
  const [myCity, setMyCity] = useState('Budva');
  const [isPrivate, setIsPrivate] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // --- RADAR ANIMATION ---
  const radarAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (discoveryMode === 'radar') {
      Animated.loop(
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [discoveryMode, radarAnim]);

  // --- SOCKET.IO LOBBY SYNC ---
  useEffect(() => {
    socket.on("receive_lobby_msg", (msg: any) => {
      setLobbyMessages(prev => [msg, ...prev]);
    });
    
    return () => { 
      socket.off("receive_lobby_msg"); 
    };
  }, []);

  // --- GHOST ENGAGEMENT ENGINE (30m to 2h) ---
  useEffect(() => {
    let ghostTimer: any;

    const scheduleGhostMessage = () => {
      const min = 30 * 60 * 1000;
      const max = 120 * 60 * 1000;
      const delay = Math.floor(Math.random() * (max - min + 1) + min);

      ghostTimer = setTimeout(() => {
        const randomGhost = NAMES[Math.floor(Math.random() * NAMES.length)];
        const randomSticker = GHOST_STICKERS[Math.floor(Math.random() * GHOST_STICKERS.length)];
        
        const ghostMsg = {
          id: Date.now().toString(),
          user: randomGhost + " " + Math.floor(Math.random() * 100),
          text: `Sent a sticker: ${randomSticker}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setLobbyMessages(prev => [ghostMsg, ...prev]);
        scheduleGhostMessage();
      }, delay);
    };

    scheduleGhostMessage();
    
    return () => clearTimeout(ghostTimer);
  }, []);

  // --- FILTERING LOGIC ---
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const s = searchQuery.toLowerCase();
      
      const matchesSearch = !p.isBanned && (
        p.town.toLowerCase().includes(s) || 
        p.name.toLowerCase().includes(s) ||
        p.sexuality.toLowerCase().includes(s)
      );
      
      const matchesGender = filterGender === 'All' || p.gender === filterGender;
      const matchesSexuality = filterSexuality === 'All' || p.sexuality === filterSexuality;
      
      return matchesSearch && matchesGender && matchesSexuality;
    });
  }, [profiles, searchQuery, filterGender, filterSexuality]);

  const favoriteProfiles = profiles.filter(p => p.isFavorite && !p.isBanned);
  
  const adminFiltered = profiles.filter(p => 
    p.name.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / USERS_PER_PAGE);
  const currentUsers = filteredProfiles.slice(
    (currentPage - 1) * USERS_PER_PAGE, 
    currentPage * USERS_PER_PAGE
  );

  // --- SWIPE HANDLER ---
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > 120) {
        completeSwipe('right');
      } else if (gesture.dx < -120) {
        completeSwipe('left');
      } else {
        Animated.spring(position, { 
          toValue: { x: 0, y: 0 }, 
          friction: 4, 
          useNativeDriver: true 
        }).start();
      }
    }
  });

  const completeSwipe = (direction: 'left' | 'right') => {
    Animated.timing(position, {
      toValue: { 
        x: direction === 'right' ? width * 1.5 : -width * 1.5, 
        y: 0 
      },
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (direction === 'right') {
        toggleLike(filteredProfiles[swipeIndex].id);
      }
      position.setValue({ x: 0, y: 0 });
      setSwipeIndex(prev => prev + 1);
    });
  };

  // --- ACTIONS ---
  const toggleLike = (id: string) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !chatUser) return;
    
    const newMsg = { 
      id: Date.now().toString(), 
      text: chatInput, 
      sender: 'me' 
    };
    
    setMessages(prev => ({ 
      ...prev, 
      [chatUser.id]: [...(prev[chatUser.id] || []), newMsg] 
    }));
    
    setChatInput('');
  };

  const sendLobbyMessage = () => {
    if (!lobbyInput.trim()) return;
    
    const msg = { 
      id: Date.now().toString(), 
      user: myName, 
      text: lobbyInput, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    socket.emit("send_lobby_msg", msg);
    setLobbyMessages(prev => [msg, ...prev]);
    setLobbyInput('');
  };

  const handlePayment = (plan: string) => {
    Alert.alert("Dateroot Secure", `Purchase ${plan} plan for full access?`, [
      { 
        text: "Cancel", 
        style: "cancel" 
      },
      { 
        text: "Pay Now", 
        onPress: () => { 
          setIsVip(true); 
          setShowPaywall(false); 
          Alert.alert("Success", "VIP UNLOCKED"); 
        }
      }
    ]);
  };

  return (
    <SafeAreaProvider> {/* This must be the VERY first tag */}
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => (
            <SafeAreaView className="flex-1 bg-white">
              <StatusBar barStyle="dark-content" />
              
              {/* HEADER SECTION */}
              {tab !== 'admin' && tab !== 'settings' && (
                <HeaderSwipe 
                  logoImg={logoImg} 
                  isVip={isVip} 
                  setShowPaywall={setShowPaywall} 
                  tab={tab} 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  setCurrentPage={setCurrentPage}
                  setShowFilters={setShowFilters} 
                  setTab={setTab} 
                  setDiscoveryMode={setDiscoveryMode} 
                  discoveryMode={discoveryMode} 
                />
              )}

              <View className="flex-1">
                {tab === 'discover' && (
                  <View className="flex-1">
                    {discoveryMode === 'list' && (
                      <>
                        <FlatList 
                          data={currentUsers} 
                          renderItem={({item}) => (
                            <UserCard 
                              item={item} 
                              onSelect={setSelectedUser} 
                              onToggleLike={toggleLike} 
                            />
                          )} 
                          numColumns={2} 
                          keyExtractor={item => item.id}
                          contentContainerStyle={{ padding: 4 }}
                          ListEmptyComponent={
                            <Text className="text-center mt-12 text-gray-400">
                              No results found in your area.
                            </Text>
                          }
                        />
                        <View className="h-[70px] flex-row justify-between items-center px-5 border-t border-gray-200">
                          <TouchableOpacity 
                            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            className="bg-green-500 p-2.5 rounded-lg min-w-[80px] items-center"
                          >
                            <Text className="text-white font-bold">Prev</Text>
                          </TouchableOpacity>
                          
                          <Text className="text-gray-800 font-bold text-base">
                            {currentPage} / {totalPages || 1}
                          </Text>
                          
                          <TouchableOpacity 
                            onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            className="bg-green-500 p-2.5 rounded-lg min-w-[80px] items-center"
                          >
                            <Text className="text-white font-bold">Next</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {discoveryMode === 'swipe' && isVip && (
                      <View className="flex-1 items-center justify-center">
                        {filteredProfiles.slice(swipeIndex, swipeIndex + 3).reverse().map((p, i) => {
                          const isTop = i === 2 || (filteredProfiles.length - swipeIndex < 3 && i === filteredProfiles.length - swipeIndex - 1);
                          return (
                            <Animated.View 
                              key={p.id} 
                              className="absolute w-[90%] h-[60%] rounded-[20px] overflow-hidden bg-white shadow-lg elevation-5"
                              style={isTop ? { transform: position.getTranslateTransform() } : {}}
                              {...(isTop ? panResponder.panHandlers : {})}
                            >
                              <Image source={{uri: p.image}} className="w-full h-[80%]" />
                              <View className="p-4">
                                <Text className="text-[22px] font-bold">{p.name}, {p.age}</Text>
                                <Text className="text-[14px] text-gray-500">{p.town} • {p.sexuality}</Text>
                              </View>
                            </Animated.View>
                          );
                        })}
                        <SwipeButton completeSwipe={completeSwipe} />
                      </View>
                    )}

                    {discoveryMode === 'radar' && isVip && (
                      <View className="flex-1 justify-center items-center bg-gray-50">
                        <Animated.View 
                          className="absolute w-[100px] h-[100px] rounded-full border-2 border-green-500"
                          style={{
                            transform: [{ scale: radarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) }],
                            opacity: radarAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
                          }} 
                        />
                        <View className="w-[15px] h-[15px] rounded-full bg-green-500 elevation-5" />
                        {filteredProfiles.slice(0, 6).map((p, i) => (
                          <TouchableOpacity 
                            key={p.id} 
                            onPress={() => setSelectedUser(p)}
                            className="absolute items-center"
                            style={{ top: 150 + Math.sin(i) * 100, left: (width/2 - 25) + Math.cos(i) * 100 }}
                          >
                            <Image source={{uri: p.image}} className="w-[50px] h-[50px] rounded-full border-2 border-white" />
                            <Text className="text-[10px] text-gray-500 font-bold">{p.distance}km</Text>
                          </TouchableOpacity>
                        ))}
                        <Text className="absolute bottom-12 text-gray-400 font-bold">
                          Scanning for connections in {myCity}...
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {tab === 'lobby' && (
                  <Lobby 
                    lobbyMessages={lobbyMessages} 
                    lobbyInput={lobbyInput} 
                    setLobbyInput={setLobbyInput} 
                    sendLobbyMessage={sendLobbyMessage} 
                  />
                )}

                {tab === 'favorites' && (
                  <View className="flex-1">
                    <Text className="text-2xl font-bold p-4 text-gray-800">
                      My Favorites ({favoriteProfiles.length})
                    </Text>
                    <FlatList 
                      data={favoriteProfiles} 
                      renderItem={({item}) => (
                        <UserCard 
                          item={item} 
                          onSelect={setSelectedUser} 
                          onToggleLike={toggleLike} 
                        />
                      )} 
                      numColumns={2} 
                      keyExtractor={item => item.id} 
                      ListEmptyComponent={
                        <Text className="text-center mt-12 text-gray-400">
                          You haven't liked anyone yet.
                        </Text>
                      }
                    />
                  </View>
                )}

                {tab === 'admin' && (
                  <AdminDashboard 
                    profiles={profiles} 
                    setProfiles={setProfiles} 
                    isVip={isVip} 
                  />
                )}

                {tab === 'settings' && (
                  <View className="flex-1">
                    {showEditProfile ? (
                      <View className="flex-1 bg-white">
                        <View className="p-4 border-b border-gray-200 bg-gray-50 flex-row items-center shadow-sm z-10">
                          <TouchableOpacity 
                            onPress={() => setShowEditProfile(false)} 
                            className="px-2 py-1"
                          >
                            <Text className="text-green-500 font-black text-[16px]">
                              ← Back to Dashboard
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <EditProfile 
                          myName={myName} 
                          setMyName={setMyName}
                          myCity={myCity} 
                          setMyCity={setMyCity}
                          isPrivate={isPrivate} 
                          setIsPrivate={setIsPrivate}
                          notificationsEnabled={notificationsEnabled} 
                          setNotificationsEnabled={setNotificationsEnabled}
                          setShowPaywall={setShowPaywall}
                        />
                      </View>
                    ) : (
                      <UserDashboard 
                        myName={myName} 
                        myCity={myCity} 
                        isVip={isVip} 
                        setShowPaywall={setShowPaywall} 
                        openEditProfile={() => setShowEditProfile(true)}
                      />
                    )}
                  </View>
                )}
              </View>

              {/* DYNAMIC BOTTOM NAV BAR (WITH SECURITY HIDING) */}
              <View className="h-20 flex-row border-t border-gray-200 bg-white pb-2">
                {[
                  {id: 'discover', label: 'Explore', icon: '🌍'},
                  {id: 'lobby', label: 'Lobby', icon: '💬'},
                  {id: 'favorites', label: 'Likes', icon: '❤️'},
                  {id: 'settings', label: 'Self', icon: '👤'},
                  ...(isAdmin ? [{id: 'admin', label: 'Mod', icon: '🛠️'}] : []) 
                ].map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    className="flex-1 justify-center items-center" 
                    onPress={() => setTab(item.id as any)}
                  >
                    <Text className="text-[20px]">{item.icon}</Text>
                    <Text className={`text-[10px] font-bold mt-1 ${tab === item.id ? 'text-green-500' : 'text-gray-400'}`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <AllModals 
                showFilters={showFilters} 
                setShowFilters={setShowFilters} 
                filterGender={filterGender} 
                setFilterGender={setFilterGender} 
                filterSexuality={filterSexuality} 
                setFilterSexuality={setFilterSexuality} 
                SEXUALITIES={SEXUALITIES} 
                setCurrentPage={setCurrentPage}
                selectedUser={selectedUser} 
                setSelectedUser={setSelectedUser} 
                toggleLike={toggleLike} 
                profiles={profiles} 
                setChatUser={setChatUser}
                chatUser={chatUser} 
                setChatUserModal={setChatUser} 
                messages={messages} 
                chatInput={chatInput} 
                setChatInput={setChatInput} 
                navigation={navigationRef}
                handleSendMessage={handleSendMessage}
              />

              <Subscription 
                showPaywall={showPaywall} 
                setShowPaywall={setShowPaywall} 
                handlePayment={handlePayment} 
              />
            </SafeAreaView>
          )}
        </Stack.Screen>
        <Stack.Screen name="VideoCall" component={VideoCall} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider> 
  );
}