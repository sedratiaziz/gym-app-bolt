import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function TestAuthScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Auth Navigation</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/Signup')}>
          <Text style={styles.buttonText}>Go to Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/Login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12221C',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
  },
  button: {
    width: '80%',
    backgroundColor: '#6FCF97',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#12221C',
    fontSize: 18,
    fontWeight: '700',
  },
}); 