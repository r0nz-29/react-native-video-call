/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
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

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
