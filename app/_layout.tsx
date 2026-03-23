import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  CinzelDecorative_400Regular,
  CinzelDecorative_700Bold,
} from '@expo-google-fonts/cinzel-decorative';
import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
} from '@expo-google-fonts/cinzel';
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_400Regular_Italic,
} from '@expo-google-fonts/eb-garamond';
import { Stack } from 'expo-router';

import { GameProvider } from '../src/context/GameContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CinzelDecorative_400Regular,
    CinzelDecorative_700Bold,
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0e1a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#c9a84c" size="large" />
      </View>
    );
  }

  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
