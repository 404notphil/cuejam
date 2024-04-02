import {
  Image,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {Themes} from '../ui/theme/Theme';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectConfigureDrill} from '../store/reducers/configureDrillReducer';
import {globalStyles} from '../ui/theme/styles';
import {Divider} from 'react-native-paper';
import {useEffect, useState} from 'react';

export function DrillScreen(): React.JSX.Element {
  const drill = useAppSelector(selectConfigureDrill);
  const dispatch = useAppDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const pauseButton = require('../assets/pause_button.png');
  const playButton = require('../assets/play_button.png');
  const imageSource = isPlaying ? pauseButton : playButton;
  const [currentBeat, setCurrentBeat] = useState(0);

  const {MetronomeModule} = NativeModules;
  // MetronomeModule.setTempo(100);
  // MetronomeModule.stop();
  // MetronomeModule.start();
  // MetronomeModule.loadSoundIntoByteArray();
  MetronomeModule.triggerEvent();
  const exampleEventEmitter = new NativeEventEmitter(MetronomeModule);
  const subscription = exampleEventEmitter.addListener('ClickEvent', data => {
    console.log('Event received', data);
    const beatData = JSON.parse(data);
    setCurrentBeat((beatData.currentBeat % drill.beatsPerPrompt) + 1);
  });

  useEffect(() => {
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Themes.dark.background,
      }}>
      <View style={{flex: 3}}>
        <Text
          style={[
            globalStyles.smallText,
            {marginHorizontal: 30, marginVertical: 10},
          ]}>
          {drill.drillName}
        </Text>

        <Divider style={{backgroundColor: 'white', marginHorizontal: 30}} />
        <Text style={localStyles.promptText}>Gb</Text>
        <Text style={localStyles.promptSubtitleText}>Maj7</Text>
      </View>

      <View style={{flex: 3}}>
        <Divider style={{backgroundColor: 'white', marginHorizontal: 30}} />
        <Text style={[localStyles.promptText, {color: 'grey'}]}>C</Text>
        <Text style={[localStyles.promptSubtitleText, {color: 'grey'}]}>
          m7B5
        </Text>
      </View>

      <View>
        <Divider style={{backgroundColor: 'white', marginHorizontal: 30}} />
        <View
          style={{
            height: 200,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (isPlaying) {
                MetronomeModule.stop();
                setCurrentBeat(1);
              } else {
                MetronomeModule.start();
              }
              setIsPlaying(!isPlaying);
            }}
            style={{alignSelf: 'center', margin: 20}}>
            <Image
              style={{
                height: 70,
                width: 70,
              }}
              source={imageSource}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[localStyles.metronomeText, {alignSelf: 'center'}]}>
            {currentBeat + ' - ' + drill.beatsPerPrompt}
          </Text>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  promptText: {
    ...globalStyles.title,
    fontSize: 80,
    textAlign: 'center',
    marginTop: 70,
  },
  promptSubtitleText: {
    ...globalStyles.title,
    fontSize: 50,
    textAlign: 'center',
  },
  metronomeText: {
    ...globalStyles.title,
    fontSize: 60,
    color: Themes.dark.errorYellowText,
    marginTop: 0,
  },
});
