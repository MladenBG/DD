import { AppRegistry } from 'react-native';
import App from './App'; // This MUST point to your real App.js where the Radar code lives
import { name as appName } from './app.json';

AppRegistry.registerComponent('main', () => App);
AppRegistry.registerComponent(appName, () => App);