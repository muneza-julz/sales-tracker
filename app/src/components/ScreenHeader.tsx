import { AlertDialog } from '@/components/AlertDialog';
import { colors, fonts } from '@/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';

/** Header used by Products / Sales / Expenses screens: logo, centered title, right icon. */
export function ScreenHeader({ title }: { title: string }) {
  const [notifyOpen, setNotifyOpen] = useState(false);
  return (
    <View style={styles.row}>
      <Icon name="logo" width={30} height={28} />
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={() => setNotifyOpen(true)} hitSlop={12}>
        <Icon name="headerIcon2" color="#000" width={21} height={21} />
      </Pressable>
      <AlertDialog
        visible={notifyOpen}
        title="Notifications"
        message="Notifications are not available yet."
        onClose={() => setNotifyOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
});
