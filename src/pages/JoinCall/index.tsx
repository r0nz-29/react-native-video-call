import {JoinCallScreenProps} from '../../types/navigation';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalStore} from '../../store';
import {DyteMeeting, Meeting as MeetingResponse} from '@dytesdk/mobile';
import {Meeting, ParticipantDetails} from '../../types/general';
import {log} from '../../utils';
import database from '@react-native-firebase/database';

export default function JoinCall({route, navigation}: JoinCallScreenProps) {
  const {contact, activeMeeting, caller} = route.params;
  const createMeeting = useGlobalStore(s => s.createMeeting);
  const addParticipant = useGlobalStore(s => s.addParticipant);
  const localUsername = useGlobalStore(s => s._username);
  const localFullName = useGlobalStore(s => s._fullName);
  const [meeting, setMeeting] = useState<Meeting>();
  const [participant, setParticipant] = useState<ParticipantDetails>();

  useEffect(() => {
    if (activeMeeting?.id) {
      log('meeting info:-', activeMeeting);
      setMeeting(activeMeeting);
      return;
    }
    createMeeting().then(meetInfo => {
      log('meeting info:-', meetInfo);
      setMeeting(meetInfo);
    });
  }, [createMeeting, activeMeeting]);

  useEffect(() => {
    if (!meeting?.id) {
      return;
    }

    addParticipant(meeting.id, localUsername, localFullName).then(
      participantInfo => {
        log('participant info:-', participantInfo);
        setParticipant(participantInfo);
      },
    );
  }, [meeting, addParticipant, localUsername, localFullName]);

  function onInitMeeting(_meeting: MeetingResponse) {
    log('received meeting:-', _meeting);

    _meeting.on(_meeting.Events.meetingEnded, () => {
      navigation.pop();
      if (activeMeeting?.id) {
        return;
      }
      database()
        .ref('/activeMeeting/' + meeting?.id)
        .remove()
        .then(() => {
          console.log('Firebase cleared');
        });
    });

    if (activeMeeting?.id) {
      return;
    }
    database()
      .ref('/activeMeeting/' + meeting?.id)
      .set({
        meeting,
        contact,
        caller: {username: localUsername, name: localFullName, icon: ''},
      })
      .then(() => console.log('Data set in firebase.'))
      .catch(err => log('Error while setting firebase data:-', err));
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text className="text-white text-3xl bg-black p-4">
            Meeting with{' '}
            {activeMeeting?.id ? caller?.username : contact.username}
          </Text>
          {participant?.token && meeting?.title ? (
            <DyteMeeting
              onInit={onInitMeeting}
              onError={_error => {
                log('error while creating meeting:-', _error);
              }}
              clientId={localUsername}
              meetingConfig={{
                roomName: meeting.title,
                authToken: participant.token,
                showSetupScreen: true,
              }}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
