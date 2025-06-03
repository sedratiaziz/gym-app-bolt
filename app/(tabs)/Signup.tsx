import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
      router.push('/(tabs)');
    } catch (err) {
      setError('Failed to create account');
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
          <Text style={styles.welcome}>Welcome to GymApp</Text>
          <Text style={styles.headline}>READY TO CHANGE THE WAY YOU WORK OUT?</Text>
          
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
            style={[styles.createBtn, loading && styles.createBtnDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.createBtnText}>
              {loading ? 'Creating account...' : 'Create account'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={() => router.push('/(tabs)/Login')}
          >
            <Text style={styles.loginBtnText}>Log in</Text>
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
  createBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtnDisabled: {
    opacity: 0.7,
  },
  createBtnText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#18181A',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});