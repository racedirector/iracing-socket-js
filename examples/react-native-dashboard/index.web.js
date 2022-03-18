import {AppRegistry} from 'react-native';
import App from './src';
import appJson from './app.json';
const {displayName, name: appName} = appJson;

document.title = displayName;

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
