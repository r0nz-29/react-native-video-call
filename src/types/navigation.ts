import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Contact} from './general';

export type NavigationRoutesWithParams = {
  register: undefined;
  'contact-list': undefined;
  'join-call': {contact: Contact};
};

export type RegisterScreenProps = NativeStackScreenProps<
  NavigationRoutesWithParams,
  'register'
>;

export type ContactListScreenProps = NativeStackScreenProps<
  NavigationRoutesWithParams,
  'contact-list'
>;

export type JoinCallScreenProps = NativeStackScreenProps<
  NavigationRoutesWithParams,
  'join-call'
>;
