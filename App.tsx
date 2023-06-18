import React from 'react';
import Register from './src/pages/Register';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useGlobalStore} from './src/store';
import ContactList from './src/pages/ContactList';
import {NavigationRoutesWithParams} from './src/types/navigation';
import JoinCall from './src/pages/JoinCall';

const Stack = createNativeStackNavigator<NavigationRoutesWithParams>();

function App(): JSX.Element {
  const username = useGlobalStore(state => state._username);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={username === '' ? 'register' : 'contact-list'}>
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="contact-list" component={ContactList} />
        <Stack.Screen
          name="join-call"
          component={JoinCall}
          options={{
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#55f',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
