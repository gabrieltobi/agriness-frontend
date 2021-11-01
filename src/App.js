import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import LoginPage from './pages/Login';
import AnimalsListPage from './pages/AnimalsList';
import AnimalPage from './pages/Animal';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="AnimalsList" component={AnimalsListPage} />
        <Stack.Screen
          name="Animal"
          component={AnimalPage}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default App;
