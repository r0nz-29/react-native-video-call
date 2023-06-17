import {JoinCallScreenProps} from '../../types/navigation';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGlobalStore} from '../../store';
import {DyteMeeting, Meeting as MeetingResponse} from '@dytesdk/mobile';
import {Meeting, ParticipantDetails} from '../../types/general';
import {log} from '../../utils';
import database from '@react-native-firebase/database';

export default function JoinCall({route}: JoinCallScreenProps) {
  const {contact} = route.params;
  const createMeeting = useGlobalStore(s => s.createMeeting);
  const addParticipant = useGlobalStore(s => s.addParticipant);
  const caller_username = useGlobalStore(s => s._username);
  const caller_fullName = useGlobalStore(s => s._fullName);
  const [meeting, setMeeting] = useState<Meeting>();
  const [participant, setParticipant] = useState<ParticipantDetails>();

  useEffect(() => {
    createMeeting().then(meetInfo => {
      log('meeting info:-', meetInfo);
      setMeeting(meetInfo);
    });
  }, [createMeeting]);

  useEffect(() => {
    if (!meeting?.id) {
      return;
    }
    addParticipant(meeting.id, caller_username).then(participantInfo => {
      log('participant info:-', participantInfo);
      setParticipant(participantInfo);
    });
  }, [meeting, addParticipant, caller_username]);

  function onInitMeeting(_meeting: MeetingResponse) {
    log('received meeting:-', _meeting);
    database()
      .ref('/activeMeeting/' + meeting?.id)
      .set({
        meeting,
        contact,
        caller: {username: caller_username, name: caller_fullName, icon: ''},
      })
      .then(() => console.log('Data set in firebase.'))
      .catch(err => log('Error while setting firebase data:-', err));
  }

  return (
    <View className="mb-20">
      <Text className="text-black text-4xl">
        Meeting with {contact.username}
      </Text>
      {participant?.token && meeting?.title ? (
        <SafeAreaView>
          <ScrollView>
            <DyteMeeting
              onInit={onInitMeeting}
              onError={_error => {
                log('error while creating meeting:-', _error);
              }}
              clientId={caller_username}
              meetingConfig={{
                roomName: meeting.title,
                authToken: participant.token,
                showSetupScreen: true,
              }}
            />
          </ScrollView>
        </SafeAreaView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
