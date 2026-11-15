import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts } from '@/theme';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddProductsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Add Product" />
      <Text style={styles.placeholder}>Form coming soon</Text>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 22 },
  placeholder: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  back: { alignItems: 'center', paddingBottom: 24 },
  backText: { fontSize: 16, fontFamily: fonts.regular, color: colors.primary },
});
