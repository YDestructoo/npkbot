
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

export default function Layout() {
  return ( 
    <Tabs
      screenOptions={({ route }) => ({
                tabBarButton: (props) => (
          <TouchableWithoutFeedback
            onPress={props.onPress}
            accessible={props.accessible}
            accessibilityRole={props.accessibilityRole}
            accessibilityState={props.accessibilityState}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        ),
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarIconStyle: {
          marginTop: 12,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          elevation: 0,
          height: 75,
        },

      })}
    >
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen 
        name="screencontroller"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'hardware-chip' : 'hardware-chip-outline'} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen 
        name="dataprediction"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}

