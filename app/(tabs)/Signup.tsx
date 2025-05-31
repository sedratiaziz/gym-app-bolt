import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ImageBackground
        source={require('../../assets/images/space-bg.png')} // Replace with your space/star background
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.welcome}>Welcome to GymApp</Text>
          <Text style={styles.headline}>READY TO CHANGE THE WAY YOU WORK OUT?</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(tabs)/Food')}>
            <Text style={styles.createBtnText}>Create account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(tabs)/Login')}>
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
  createBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
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