import { colors } from '@/theme';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-products" options={{ presentation: 'card' }} />
        <Stack.Screen name="add-sales" options={{ presentation: 'card' }} />
        <Stack.Screen name="add-expenses" options={{ presentation: 'card' }} />
        <Stack.Screen name="success" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
