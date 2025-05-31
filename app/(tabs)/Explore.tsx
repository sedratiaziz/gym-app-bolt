import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const categories = [
  { label: 'Food', icon: require('../../assets/images/space-bg.png') },
  { label: 'Groceries', icon: require('../../assets/images/space-bg.png') },
  { label: 'Health & beauty', icon: require('../../assets/images/space-bg.png') },
  { label: 'Stores', icon: require('../../assets/images/space-bg.png') },
  { label: 'Dine-in', icon: require('../../assets/images/space-bg.png') },
];

const supplements = [
  { name: 'Whey Protein', shop: 'Fit Gym', price: 35, image: 'https://images.pexels.com/photos/416451/pexels-photo-416451.jpeg', tag: 'Protein' },
  { name: 'Creatine', shop: 'Muscle Shop', price: 20, image: 'https://images.pexels.com/photos/416452/pexels-photo-416452.jpeg', tag: 'Creatine' },
  { name: 'Amino Acid', shop: 'Power Gym', price: 25, image: 'https://images.pexels.com/photos/416453/pexels-photo-416453.jpeg', tag: 'Amino' },
];

const coaches = [
  { name: 'John Doe', location: 'New York, NY', price: 50, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Jane Smith', location: 'Los Angeles, CA', price: 65, image: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { name: 'Mike Johnson', location: 'Chicago, IL', price: 40, image: 'https://randomuser.me/api/portraits/men/45.jpg' },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Orange Header */}
      <View style={styles.orangeHeader}>
        <Text style={styles.time}>09:41</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerLabel}>Deliver to</Text>
          <View style={styles.headerAddress} />
        </View>
        {/* Search Bar */}
        <View style={styles.searchBarRow}>
          <Ionicons name="search" size={22} color="#A3C1B4" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food, groceries & more"
            placeholderTextColor="#A3C1B4"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Category Slider */}
        <FlatList
          data={categories}
          keyExtractor={item => item.label}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categorySlider}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </View>
          )}
        />
        {/* Supplements Section */}
        <Text style={styles.hotTitle}>Supplements</Text>
        <FlatList
          data={supplements}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hotSlider}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <View style={styles.hotCard}>
              <Image source={{ uri: item.image }} style={styles.hotImage} />
              <View style={styles.hotCardOverlay}>
                <Text style={styles.hotTag}>{item.tag}</Text>
                <TouchableOpacity style={styles.heartBtn}>
                  <Ionicons name="heart-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.hotName}>{item.name}</Text>
              <Text style={styles.hotShop}>{item.shop}</Text>
              <Text style={styles.hotPrice}>${item.price}</Text>
            </View>
          )}
        />
        {/* Coaching Services Section */}
        <Text style={styles.hotTitle}>Coaching Services</Text>
        <FlatList
          data={coaches}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hotSlider}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <View style={styles.hotCard}>
              <Image source={{ uri: item.image }} style={styles.hotImage} />
              <Text style={styles.hotName}>{item.name}</Text>
              <Text style={styles.hotShop}>{item.location}</Text>
              <Text style={styles.hotPrice}>${item.price}/session</Text>
            </View>
          )}
        />
        {/* Redeem and Save Section */}
        <View style={styles.redeemSection}>
          <Text style={styles.redeemTitle}>Redeem and save</Text>
          <View style={styles.redeemRow}>
            <View style={styles.redeemCard}>
              <Ionicons name="wallet" size={28} color="#F9B233" />
              <Text style={styles.redeemLabel}>413 points</Text>
            </View>
            <View style={styles.redeemCard}>
              <Ionicons name="pricetag" size={28} color="#F9B233" />
              <Text style={styles.redeemLabel}>Vouchers</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  orangeHeader: { backgroundColor: '#FF6B00', paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  time: { color: '#fff', fontWeight: '700', fontSize: 18, alignSelf: 'flex-start', marginTop: 8, marginLeft: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 16 },
  headerLabel: { color: '#fff', fontSize: 16, fontWeight: '500', marginRight: 8 },
  headerAddress: { backgroundColor: '#fff', opacity: 0.2, borderRadius: 8, width: 160, height: 22 },
  searchBarRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, marginHorizontal: 16, marginTop: 18, paddingVertical: 4 },
  searchInput: { flex: 1, fontSize: 16, color: '#14241C', backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 12 },
  categorySlider: { marginTop: -28, marginBottom: 8 },
  categoryCard: { alignItems: 'center', marginRight: 18, backgroundColor: '#fff', borderRadius: 16, padding: 10, width: 90, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  categoryIcon: { width: 40, height: 40, marginBottom: 6 },
  categoryLabel: { fontSize: 13, color: '#14241C', fontWeight: '600' },
  hotTitle: { fontSize: 18, fontWeight: '700', color: '#14241C', marginLeft: 16, marginTop: 18, marginBottom: 8 },
  hotSlider: { marginBottom: 8 },
  hotCard: { backgroundColor: '#fff', borderRadius: 18, marginRight: 16, width: windowWidth * 0.48, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, paddingBottom: 10 },
  hotImage: { width: '100%', height: 110, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  hotCardOverlay: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hotTag: { backgroundColor: '#fff', color: '#16A06A', fontWeight: '700', fontSize: 13, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  heartBtn: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 4 },
  hotName: { fontSize: 15, fontWeight: '700', color: '#14241C', marginTop: 8, marginLeft: 10 },
  hotShop: { fontSize: 13, color: '#8E8E93', marginLeft: 10, marginTop: 2 },
  hotPrice: { fontSize: 15, color: '#16A06A', fontWeight: '700', marginLeft: 10, marginTop: 2 },
  redeemSection: { marginTop: 18, paddingHorizontal: 16 },
  redeemTitle: { fontSize: 18, fontWeight: '700', color: '#14241C', marginBottom: 10 },
  redeemRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  redeemCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginRight: 16, alignItems: 'center', flexDirection: 'row', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  redeemLabel: { fontSize: 15, color: '#14241C', fontWeight: '600', marginLeft: 8 },
}); 