/**
 * @format
 */

import {AppRegistry, LogBox, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerGlobals} from 'react-native-webrtc';
import {reOpenApp} from './src/utils';

registerGlobals();

AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () =>
    ({name, callUUID, handle}) => {
      return Promise.resolve();
    },
);

AppRegistry.registerHeadlessTask('reopen app', reOpenApp);

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
