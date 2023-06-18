import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {contacts, log} from '../../utils';
import {Contact, FirebaseSnapshot, Meeting} from '../../types/general';
import {ContactListScreenProps} from '../../types/navigation';
import database from '@react-native-firebase/database';
import RNCallKeep from 'react-native-callkeep';
import {useGlobalStore} from '../../store';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {callerSetupOptions} from '../JoinCall/Callkeep';

export default function ContactList({navigation}: ContactListScreenProps) {
  const username = useGlobalStore(state => state._username);
  const [callIntercepted, setCallIntercepted] = useState(false);
  const [details, setDetails] = useState<{meeting: Meeting; caller: Contact}>();

  function initiateCall(contact: Contact) {
    console.log(contact);
    navigation.push('join-call', {contact});
  }

  useEffect(() => {
    const listener = database()
      .ref('/activeMeeting')
      .on('child_added', _snapshot => {
        if (username === '') {
          console.log('set username');
          return;
        }

        const snapshot = _snapshot.val() as FirebaseSnapshot;

        if (Object.keys(snapshot).length === 0) {
          console.log('empty');
          console.log(snapshot);
          return;
        }
        // @ts-ignore
        const {meeting, contact, caller} = snapshot;

        // console.log(contact.username, username);
        if (contact.username === username && !callIntercepted) {
          setDetails({meeting, caller});
          RNCallKeep.displayIncomingCall(
            uuidv4(),
            caller.username,
            caller.name,
          );
          setCallIntercepted(true);
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref('/activeMeeting').off('child_added', listener);
  }, [navigation, username, callIntercepted]);

  function onEndCallAction(data: {callUUID: string}) {
    const {callUUID} = data;
    RNCallKeep.endCall(callUUID);
  }

  useEffect(() => {
    function onAnswerCallAction(data: {callUUID: string}) {
      const {callUUID} = data;
      RNCallKeep.endCall(callUUID);
      if (details?.caller && details.meeting) {
        log('details', details);
        navigation.push('join-call', {
          contact: {name: '', username: '', icon: ''},
          caller: details?.caller,
          activeMeeting: details?.meeting,
        });
      }
    }

    try {
      RNCallKeep.setup(callerSetupOptions);
      RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
      RNCallKeep.addEventListener('endCall', onEndCallAction);
    } catch (err) {
      log('initializeCallKeep error:', err);
    }
  }, [details, navigation]);

  return (
    <View className="p-4 pt-8 bg-white min-h-screen">
      <Text className="text-black text-4xl font-bold mb-4">My Contacts</Text>
      <View>
        {contacts.map(contact => (
          <TouchableOpacity
            key={contact.username}
            onPress={() => initiateCall(contact)}
            className="flex flex-row justify-start items-center gap-x-4 my-2">
            <Image
              source={{uri: contact.icon}}
              className="w-16 h-16 rounded-full"
            />
            <Text className="text-black text-xl">{contact.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
