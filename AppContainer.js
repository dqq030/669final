import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import DaysScreen from "./screens/DaysScreen.js";
import EditScreen from "./screens/EditScreen.js";
import DetailsScreen from "./screens/DetailsScreen.js";
import AccountScreen from "./screens/AccountScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import day from "./features/daySlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import authSlice from "./features/authSlice";
import FriendsScreen from "./screens/FriendsScreen.js";
import ShareScreen from "./screens/ShareScreen.js";

const store = configureStore({
  reducer: {
    day,
    authSlice,
  },
});

function DaysTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Days"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Days" component={DaysScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
    </Stack.Navigator>
  );
}

function AccountTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}

function FriendsTabStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Friends"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Friends" component={FriendsScreen} />
    </Stack.Navigator>
  );
}

function AppTab() {
  const Tabs = createBottomTabNavigator();
  
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Days"
        component={DaysTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name="calendar-number-outline"
                color={color}
                size={size}
                type="font-awesome"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Friends"
        component={FriendsTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="people" color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="Account"
        component={AccountTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="person" color={color} size={size} />;
          },
        }}
      />
    </Tabs.Navigator>
  );
}


function AppContainer() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="App" component={AppTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default AppContainer;
