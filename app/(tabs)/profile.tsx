import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Bell, Share2, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [metricUnits, setMetricUnits] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileStats}>12 Workouts • 3.5 kg lost</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>App Settings</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color="#0066FF" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E5EA', true: '#0066FF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Moon size={20} color="#8E8E93" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E5E5EA', true: '#0066FF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Weight size={20} color="#8E8E93" />
              <Text style={styles.settingLabel}>Use Metric Units</Text>
            </View>
            <Switch
              value={metricUnits}
              onValueChange={setMetricUnits}
              trackColor={{ false: '#E5E5EA', true: '#0066FF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Other</Text>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingLabelContainer}>
              <Share2 size={20} color="#8E8E93" />
              <Text style={styles.settingLabel}>Share App</Text>
            </View>
            <ChevronRight size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingLabelContainer}>
              <HelpCircle size={20} color="#8E8E93" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <View style={styles.settingLabelContainer}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={[styles.settingLabel, { color: '#FF3B30' }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066FF',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066FF',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

// Missing icon components
const Moon = ({ size, color }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size, backgroundColor: 'transparent', borderWidth: 2, borderColor: color }} />
      <View style={{ position: 'absolute', width: size * 0.5, height: size * 0.5, borderRadius: size, backgroundColor: color, top: size * 0.15, right: size * 0.15 }} />
    </View>
  );
};

const Weight = ({ size, color }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.7, height: size * 0.15, backgroundColor: color, borderRadius: size * 0.05 }} />
      <View style={{ position: 'absolute', width: size * 0.2, height: size * 0.6, backgroundColor: color, left: size * 0.1, borderRadius: size * 0.05 }} />
      <View style={{ position: 'absolute', width: size * 0.2, height: size * 0.6, backgroundColor: color, right: size * 0.1, borderRadius: size * 0.05 }} />
    </View>
  );
};

const Dumbbell = ({ size, color }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.7, height: size * 0.15, backgroundColor: color, borderRadius: size * 0.05 }} />
      <View style={{ position: 'absolute', width: size * 0.25, height: size * 0.5, backgroundColor: color, left: 0, borderRadius: size * 0.05 }} />
      <View style={{ position: 'absolute', width: size * 0.25, height: size * 0.5, backgroundColor: color, right: 0, borderRadius: size * 0.05 }} />
    </View>
  );
};