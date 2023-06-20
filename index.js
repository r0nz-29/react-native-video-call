/**
 * @format
 */

import {AppRegistry, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerGlobals} from 'react-native-webrtc';

registerGlobals();

AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () =>
    ({name, callUUID, handle}) => {
      return Promise.resolve();
    },
);
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
// LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
