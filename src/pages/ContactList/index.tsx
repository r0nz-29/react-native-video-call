import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {contacts} from '../../utils';
import {Contact} from '../../types/general';
import {ContactListScreenProps} from '../../types/navigation';

export default function ContactList({navigation}: ContactListScreenProps) {
  function initiateCall(contact: Contact) {
    console.log(contact);
    navigation.push('join-call', {contact});
  }

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
