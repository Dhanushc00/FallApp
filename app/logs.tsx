// AlertHistoryList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import {AlertItem, clearAlertLogData, RootState} from '../store/store';
import { useDispatch, useSelector } from 'react-redux';

const Logs = () => {
  const dispatch = useDispatch();
  const alerts:AlertItem[] = useSelector((state: RootState)=> state.AlertLogs);
  const renderItem = ({ item }: { item: AlertItem }) => {
    const statusColor = item.status === 'dismissed' ? '#4CAF50' : '#FF5252';
    
    return (
      <View style={styles.listItem}>
        <View style={styles.leftContent}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.actions}>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
    {/* Top Bar with Dustbin */}
    <View style={styles.topBar}>
      <Text/>
      <TouchableOpacity 
        style={styles.dustbinButton}
        onPress={()=>dispatch(clearAlertLogData())}
      >
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>

    <FlatList
      data={alerts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
  },
  container: {
    marginTop: 50,
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50, // Adjust based on your status bar height
    paddingBottom: 10,
    // backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dustbinButton: {
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  leftContent: {
    flex: 1,
  },
  timestamp: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
});

export default Logs;