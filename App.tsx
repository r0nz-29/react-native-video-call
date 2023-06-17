import React, {createRef, useEffect} from 'react';
import Register from './src/pages/Register';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useGlobalStore} from './src/store';
import ContactList from './src/pages/ContactList';
import {NavigationRoutesWithParams} from './src/types/navigation';
import JoinCall from './src/pages/JoinCall';
import database from '@react-native-firebase/database';
import {log} from './src/utils';
import RNCallKeep from 'react-native-callkeep';
import {callerSetupOptions} from './src/pages/JoinCall/Callkeep';
import 'react-native-get-random-values';
import {FirebaseSnapshot} from './src/types/general';
import {v4 as uuidv4} from 'uuid';

const Stack = createNativeStackNavigator<NavigationRoutesWithParams>();

function App(): JSX.Element {
  const username = useGlobalStore(state => state._username);
  const navigationRef =
    createRef<NavigationContainerRef<NavigationRoutesWithParams>>();

  useEffect(() => {
    const listener = database()
      .ref('/activeMeeting')
      .on('child_added', snapshot => {
        if (username === '') {
          return;
        }

        const {meeting, contact, caller} = snapshot.val() as FirebaseSnapshot;
        log('firebase contact:-', contact);
        log('firebase caller:-', caller);
        log('firebase meeting:-', meeting);
        // navigationRef.current?.navigate('join-call', {
        //   contact: {name: '', username: '', icon: ''},
        // });
        if (contact.username === username) {
          RNCallKeep.displayIncomingCall(
            uuidv4(),
            caller.username,
            caller.name,
          );
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref('/activeMeeting').off('child_added', listener);
  });

  useEffect(() => {
    try {
      RNCallKeep.setup(callerSetupOptions);
      RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
    } catch (err) {
      log('initializeCallKeep error:', err);
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={username === '' ? 'register' : 'contact-list'}>
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="contact-list" component={ContactList} />
        <Stack.Screen name="join-call" component={JoinCall} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
