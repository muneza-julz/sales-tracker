import { colors, fonts } from '@/theme';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';

/** Header used by Products / Sales / Expenses screens: logo, centered title, right icon. */
export function ScreenHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Icon name="logo" width={30} height={28} />
      <Text style={styles.title}>{title}</Text>
      <Icon name="headerIcon2" color="#000" width={21} height={21} />
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
