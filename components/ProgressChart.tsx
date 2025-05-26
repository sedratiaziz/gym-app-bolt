import { View, Text, StyleSheet } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';

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

  return (
    <View style={[styles.container, style]}>
      <RNLineChart
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

// Placeholder component to handle SSR and web environment
// This is a simplified implementation for the code example
const LineChart = ({ data, width, height, chartConfig, bezier, style }) => {
  return (
    <View style={[{ width, height }, style]}>
      <Text>Chart would be rendered here in a real mobile environment</Text>
      {/* In a real implementation, conditionally import the real chart component */}
    </View>
  );
};

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
  },
  placeholderText: {
    color: '#8E8E93',
    fontWeight: '500',
  }
});