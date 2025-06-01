import React, { createContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';
import { Home, Dumbbell, LineChart, User, GlassWater, Search, Plus, Compass } from 'lucide-react-native';

// Define the Exercise type
interface Exercise {
  id?: number;
  name: string;
  weights: number[];
}

// Define the Workout type
export interface Workout {
  id: number;
  name: string;
  day: string;
  reps: number;
  image: string;
  exercises: Exercise[];
}

// Create context
export const WorkoutsContext = createContext<{
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
}>({ workouts: [], setWorkouts: () => {} });

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const activeColor = '#6FCF97';
  const inactiveColor = '#fff';
  const inactiveOpacity = 0.7;

  return (
    <WorkoutsContext.Provider value={{ workouts, setWorkouts }}>
      <View style={{ flex: 1, backgroundColor: '#12221C' }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={pathname === '/(tabs)' || pathname === '/(tabs)/index' ? styles.navItemActive : styles.navItem}
            onPress={() => router.push('/(tabs)')}
          >
            <Dumbbell size={28} color={pathname.startsWith('/(tabs)/workouts') ? activeColor : inactiveColor} opacity={pathname.startsWith('/(tabs)/workouts') ? 1 : inactiveOpacity} />
            <Text style={pathname === '/(tabs)' || pathname === '/(tabs)/index' ? styles.navLabelActive : styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={pathname.startsWith('/(tabs)/food') ? styles.navItemActive : styles.navItem}
            onPress={() => router.push('/(tabs)/Food')}
          >
            <GlassWater size={28} color={pathname.startsWith('/(tabs)/food') ? activeColor : inactiveColor} opacity={pathname.startsWith('/(tabs)/food') ? 1 : inactiveOpacity} />
            <Text style={pathname.startsWith('/(tabs)/food') ? styles.navLabelActive : styles.navLabel}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={pathname.startsWith('/(tabs)/Explore') ? styles.navItemActive : styles.navItem}
            onPress={() => router.push('/(tabs)/Explore')}
          >
            <Compass size={28} color={pathname.startsWith('/(tabs)/Explore') ? activeColor : inactiveColor} opacity={pathname.startsWith('/(tabs)/Explore') ? 1 : inactiveOpacity} />
            <Text style={pathname.startsWith('/(tabs)/Explore') ? styles.navLabelActive : styles.navLabel}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={pathname.startsWith('/(tabs)/progress') ? styles.navItemActive : styles.navItem}
            onPress={() => router.push('/(tabs)/progress')}
          >
            <LineChart size={28} color={pathname.startsWith('/(tabs)/progress') ? activeColor : inactiveColor} opacity={pathname.startsWith('/(tabs)/progress') ? 1 : inactiveOpacity} />
            <Text style={pathname.startsWith('/(tabs)/progress') ? styles.navLabelActive : styles.navLabel}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={pathname.startsWith('/(tabs)/profile') ? styles.navItemActive : styles.navItem}
            onPress={() => router.push('/(tabs)/profile')}
          >          
            <User size={28} color={pathname.startsWith('/(tabs)/profile') ? activeColor : inactiveColor} opacity={pathname.startsWith('/(tabs)/profile') ? 1 : inactiveOpacity} />
            <Text style={pathname.startsWith('/(tabs)/profile') ? styles.navLabelActive : styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WorkoutsContext.Provider>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#12221C',
    borderTopWidth: 1,
    borderTopColor: '#22332B',
    height: 70,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  navLabelActive: {
    color: '#6FCF97',
    fontSize: 13,
    fontWeight: '700',
  },
});