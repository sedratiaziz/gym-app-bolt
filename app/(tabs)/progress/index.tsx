import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Weight, ChartLine as LineChart, Ruler, Camera } from 'lucide-react-native';
import { ProgressChart } from '@/components/ProgressChart';
import { WeightLogForm } from '@/components/WeightLogForm';
import { useWeightHistory } from '@/hooks/useWeightHistory';

export default function ProgressScreen() {
  const router = useRouter();
  const { getRecentWeightEntries, getWeightTrend } = useWeightHistory();
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [activeTab, setActiveTab] = useState('weight');

  const weightEntries = getRecentWeightEntries(7);
  const weightTrend = getWeightTrend();

  const renderContent = () => {
    switch (activeTab) {
      case 'weight':
        return (
          <View style={styles.tabContent}>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Weight Progress</Text>
                <TouchableOpacity 
                  style={styles.logButton}
                  onPress={() => setShowWeightForm(true)}
                >
                  <Text style={styles.logButtonText}>Log Weight</Text>
                </TouchableOpacity>
              </View>
              
              <ProgressChart 
                data={weightEntries} 
                type="weight" 
                style={styles.chart} 
              />
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{weightTrend.current} kg</Text>
                  <Text style={styles.statLabel}>Current</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[
                    styles.statValue,
                    weightTrend.change < 0 ? styles.statNegative : styles.statPositive
                  ]}>
                    {weightTrend.change > 0 ? '+' : ''}{weightTrend.change} kg
                  </Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{weightTrend.average} kg</Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Entries</Text>
              {weightEntries.length > 0 ? (
                weightEntries.map((entry, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyDate}>{entry.date}</Text>
                    <Text style={styles.historyValue}>{entry.value} kg</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyHistoryText}>No weight entries yet</Text>
              )}
            </View>
          </View>
        );
      case 'measurements':
        return (
          <View style={styles.tabContent}>
            <View style={styles.emptyTabContent}>
              <Ruler size={48} color="#E5E5EA" />
              <Text style={styles.emptyTabTitle}>Body Measurements</Text>
              <Text style={styles.emptyTabText}>
                Track your body measurements to see changes over time.
              </Text>
              <TouchableOpacity style={styles.emptyTabButton}>
                <Text style={styles.emptyTabButtonText}>Log Measurements</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'photos':
        return (
          <View style={styles.tabContent}>
            <View style={styles.emptyTabContent}>
              <Camera size={48} color="#E5E5EA" />
              <Text style={styles.emptyTabTitle}>Progress Photos</Text>
              <Text style={styles.emptyTabText}>
                Take photos to visually track your fitness journey.
              </Text>
              <TouchableOpacity style={styles.emptyTabButton}>
                <Text style={styles.emptyTabButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'weight' && styles.activeTabItem]}
          onPress={() => setActiveTab('weight')}
        >
          <Weight 
            size={20} 
            color={activeTab === 'weight' ? '#0066FF' : '#8E8E93'} 
          />
          <Text 
            style={[styles.tabText, activeTab === 'weight' && styles.activeTabText]}
          >
            Weight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'measurements' && styles.activeTabItem]}
          onPress={() => setActiveTab('measurements')}
        >
          <Ruler 
            size={20} 
            color={activeTab === 'measurements' ? '#0066FF' : '#8E8E93'} 
          />
          <Text 
            style={[styles.tabText, activeTab === 'measurements' && styles.activeTabText]}
          >
            Measurements
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'photos' && styles.activeTabItem]}
          onPress={() => setActiveTab('photos')}
        >
          <Camera 
            size={20} 
            color={activeTab === 'photos' ? '#0066FF' : '#8E8E93'} 
          />
          <Text 
            style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}
          >
            Photos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {showWeightForm && (
        <WeightLogForm 
          onSave={() => setShowWeightForm(false)} 
          onCancel={() => setShowWeightForm(false)} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#0066FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContent: {
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  logButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  chart: {
    height: 200,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  statPositive: {
    color: '#34C759',
  },
  statNegative: {
    color: '#FF3B30',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EFEFEF',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  historyDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    padding: 16,
  },
  emptyTabContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTabText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyTabButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyTabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});