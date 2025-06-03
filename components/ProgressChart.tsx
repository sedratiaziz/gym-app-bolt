import { View, Text, StyleSheet, Platform } from 'react-native';

// Placeholder component for web environment
const LineChart = ({ data, width, height, chartConfig, bezier, style }) => {
  return (
    <View style={[{ width, height }, style]}>
      <View style={styles.placeholderChart}>
        <Text style={styles.placeholderText}>
          Chart visualization is only available in mobile environments
        </Text>
      </View>
    </View>
  );
};

// Only import the chart library when not on web platform
const RNLineChart = Platform.OS === 'web' ? LineChart : require('react-native-chart-kit').LineChart;

export function ProgressChart({ data, type, style }) {
  // If there's not enough data, show a placeholder
  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.placeholderChart}>
          <Text style={styles.placeholderText}>
            Not enough data to generate chart
          </Text>
        </View>
      </View>
    );
  }

  // Prepare data for the chart
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        data: data.map(item => item.value),
        color: () => '#0066FF',
        strokeWidth: 2
      }
    ],
    legend: [type === 'weight' ? 'Weight (kg)' : 'Measurement']
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: type === 'weight' ? 1 : 0,
    color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0066FF'
    }
  };

  const ChartComponent = Platform.OS === 'web' ? LineChart : RNLineChart;

  return (
    <View style={[styles.container, style]}>
      <ChartComponent
        data={chartData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  placeholderChart: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  }
});