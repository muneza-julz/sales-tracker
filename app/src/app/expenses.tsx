import { getExpenses } from '@/api';
import type { Expense, ExpenseCategory } from '@/api/types';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radius } from '@/theme';
import { formatMoney } from '@/utils/format';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORY_ICONS: Record<ExpenseCategory, 'expRent' | 'expTransport' | 'expUtilities' | 'expSupplies'> = {
  RENT: 'expRent',
  TRANSPORT: 'expTransport',
  UTILITIES: 'expUtilities',
  OTHERS: 'expSupplies',
};

export default function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Expenses" />
            <Pressable style={styles.addButton} onPress={() => router.push('/add-expenses')}>
              <Icon name="plusBtn" color="#fff" width={18} height={14} />
              <Text style={styles.addButtonText}>Add Expenses</Text>
            </Pressable>
          </>
        }
        renderItem={({ item }) => <ExpenseRow expense={item} />}
      />
    </View>
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Icon name={CATEGORY_ICONS[expense.category]} color="#fff" width={30} height={28} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.date}>{formatDate(expense.timestamp)}</Text>
      </View>
      <Text style={styles.amount}>−{formatMoney(expense.amount)}</Text>
      <Icon name="more" color="#000" width={8} height={28} />
    </View>
  );
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: colors.danger, textAlign: 'center' },
  list: { paddingHorizontal: 22, paddingBottom: 32 },
  separator: { height: 1, backgroundColor: colors.borderStrong, marginVertical: 6 },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    height: 60,
    marginBottom: 24,
  },
  addButtonText: { color: '#fff', fontSize: 20, fontFamily: fonts.regular },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  title: { fontSize: 18, fontFamily: fonts.regular, color: colors.text },
  date: { fontSize: 15, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 4 },
  amount: { fontSize: 20, fontFamily: fonts.regular, color: colors.text, marginLeft: 12 },
});
