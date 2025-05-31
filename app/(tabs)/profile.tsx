import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, User, Bell, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={28} color="#F8F8F8" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Ethan Carter</Text>
        <Text style={styles.profileSubtitle}>Member since 2022</Text>
      </View>

      <Text style={styles.accountTitle}>Account</Text>

      <View style={styles.accountSection}>
        <TouchableOpacity style={styles.accountRow}>
          <View style={styles.iconContainer}>
            <User size={28} color="#F8F8F8" />
          </View>
          <Text style={styles.accountLabel}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountRow}>
          <View style={styles.iconContainer}>
            <Bell size={28} color="#F8F8F8" />
          </View>
          <Text style={styles.accountLabel}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountRow}>
          <View style={styles.iconContainer}>
            <Settings size={28} color="#F8F8F8" />
          </View>
          <Text style={styles.accountLabel}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountRow}>
          <View style={styles.iconContainer}>
            <HelpCircle size={28} color="#F8F8F8" />
          </View>
          <Text style={styles.accountLabel}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#6FCF97',
          borderRadius: 24,
          paddingVertical: 16,
          alignItems: 'center',
          margin: 24,
        }}
        onPress={() => router.push('/(tabs)/test-auth')}
      >
        <Text style={{ color: '#12221C', fontSize: 18, fontWeight: '700' }}>Test Auth Navigation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14241C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8F8F8',
    textAlign: 'center',
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    right: 24,
    top: 32,
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#EAD9C7',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8F8F8',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 20,
    color: '#7FC1A4',
    marginBottom: 8,
  },
  accountTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8F8F8',
    marginLeft: 32,
    marginBottom: 16,
  },
  accountSection: {
    marginHorizontal: 0,
    marginBottom: 32,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#223D33',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  accountLabel: {
    fontSize: 22,
    color: '#F8F8F8',
    fontWeight: '400',
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 32,
    alignItems: 'center',
  },
  logoutButton: {
    width: '90%',
    backgroundColor: '#223D33',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#F8F8F8',
    fontSize: 22,
    fontWeight: '700',
  },
});