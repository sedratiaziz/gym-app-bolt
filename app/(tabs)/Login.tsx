import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      router.push('/(tabs)');
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ImageBackground
        source={require('../../assets/images/space-bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.headline}>LOG IN TO YOUR ACCOUNT</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Logging in...' : 'Log in'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.createBtn} 
            onPress={() => router.push('/(tabs)/Signup')}
          >
            <Text style={styles.createBtnText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  welcome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginTop: 60,
    marginBottom: 12,
  },
  headline: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 40,
    lineHeight: 38,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#FF4545',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#18181A',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  createBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
});