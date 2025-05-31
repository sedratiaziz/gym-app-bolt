import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const supplements = [
  { name: 'Whey Protein', shop: 'Fit Gym', price: 35, image: 'https://images.pexels.com/photos/416451/pexels-photo-416451.jpeg' },
  { name: 'Creatine', shop: 'Muscle Shop', price: 20, image: 'https://images.pexels.com/photos/416452/pexels-photo-416452.jpeg' },
  { name: 'BCAA', shop: 'Power Gym', price: 25, image: 'https://images.pexels.com/photos/416453/pexels-photo-416453.jpeg' },
];

export default function SupplementsScreen() {
  const [search, setSearch] = useState('');
  const filteredSupplements = supplements.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Supplements</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search supplements, shop..."
          placeholderTextColor="#A3C1B4"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>All</Text></TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Protein</Text></TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Vitamins</Text></TouchableOpacity>
        </View>
        {filteredSupplements.map((supplement, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={{ uri: supplement.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{supplement.name}</Text>
              <Text style={styles.cardShop}>{supplement.shop}</Text>
              <Text style={styles.cardPrice}>${supplement.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#14241C' },
  searchRow: { paddingHorizontal: 20, paddingBottom: 10 },
  searchInput: { backgroundColor: '#F5F5F7', borderRadius: 12, padding: 14, fontSize: 16, color: '#14241C' },
  categoryRow: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20, marginBottom: 16 },
  categoryButton: { backgroundColor: '#F5F5F7', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, marginRight: 10 },
  categoryText: { color: '#14241C', fontSize: 15, fontWeight: '600' },
  scrollView: { flex: 1 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 20, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2, alignItems: 'center', padding: 16 },
  cardImage: { width: 64, height: 64, borderRadius: 32, marginRight: 18 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: '700', color: '#14241C' },
  cardShop: { fontSize: 15, color: '#8E8E93', marginTop: 2 },
  cardPrice: { fontSize: 16, color: '#16A06A', fontWeight: '600', marginTop: 6 },
}); 