import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Weight, ChartLine as LineChart, Ruler, Camera } from 'lucide-react-native';
import { ProgressChart } from '@/components/ProgressChart';
import { WeightLogForm } from '@/components/WeightLogForm';
import { useWeightHistory } from '@/hooks/useWeightHistory';

export default function BodyWeightScreen() {
  const router = useRouter();
  const { getRecentWeightEntries, getWeightTrend } = useWeightHistory();
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [activeTab, setActiveTab] = useState('weight');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');

  const weightEntries = getRecentWeightEntries(7);
  const weightTrend = getWeightTrend();

  // Placeholder data
  const currentWeight = 150;
  const percentChange = -2;
  const chartData = [
    0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 1.0, 0.8, 0.6, 0.9, 0.7, 1.0
  ];

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Body Weight</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.sectionTitle}>Log Weight</Text>
        <View style={[styles.inputRow]}>
          <View style={[styles.inputCol]}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Weight (lbs)"
              placeholderTextColor="#A3C1B4"
            />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Date"
              placeholderTextColor="#A3C1B4"
            />
          </View>
          <View style={[styles.saveRow]}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Progress</Text>
        <Text style={styles.progressLabel}>Weight</Text>
        <Text style={styles.weightValue}>{currentWeight} lbs</Text>
        <Text style={styles.progressSubLabel}>
          Last 30 days <Text style={percentChange < 0 ? styles.negative : styles.positive}>{percentChange}%</Text>
        </Text>
        <View style={styles.chartContainer}>
          {/* Replace this with a real chart in production */}
          <LineChartPlaceholder data={chartData} />
        </View>
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

function LineChartPlaceholder({ data }: { data: number[] }) {
  // This is a simple SVG placeholder for the line chart
  // In production, use react-native-svg or a chart library
  return (
    <View style={{ height: 180, width: '100%', marginTop: 12 }}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ height: '100%', width: '100%', position: 'absolute', left: 0, top: 0 }}>
          {/* Simulate a line chart with a green line */}
          <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: 'rgba(111, 207, 151, 0.5)' }} />
        </View>
      </View>
      <View style={styles.chartLabelsRow}>
        <Text style={styles.chartLabel}>Jan</Text>
        <Text style={styles.chartLabel}>Feb</Text>
        <Text style={styles.chartLabel}>Mar</Text>
        <Text style={styles.chartLabel}>Apr</Text>
        <Text style={styles.chartLabel}>May</Text>
        <Text style={styles.chartLabel}>Jun</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12221C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'column',
    alignItems: 'center',    
    width: '100%',
    marginBottom: 30,
  },
  inputCol: {
    flex: 1,
    width: '100%',
  },
  input: {
    backgroundColor: '#234135',
    borderRadius: 20,
    width: '100%',
    padding: 18,
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  saveRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  saveButton: {
    width: '30%',
    backgroundColor: '#16A06A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 18,
  },
  weightValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 2,
  },
  progressSubLabel: {
    color: '#A3C1B4',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },
  negative: {
    color: '#FF6B57',
    fontWeight: '700',
  },
  positive: {
    color: '#6FCF97',
    fontWeight: '700',
  },
  chartContainer: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  chartLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  chartLabel: {
    color: '#A3C1B4',
    fontSize: 15,
    fontWeight: '500',
  },
  tabContent: {
    marginBottom: 24,
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