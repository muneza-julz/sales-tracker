import { colors, fonts, radius } from '@/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={96} color={colors.primary} />
      </View>
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.subtitle}>Your entry has been saved.</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: { marginBottom: 24 },
  title: { fontSize: 28, fontFamily: fonts.semiBold, color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: 36 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 14,
    paddingHorizontal: 56,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: { fontSize: 18, fontFamily: fonts.semiBold, color: '#fff' },
});
