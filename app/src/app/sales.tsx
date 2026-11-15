import { getSalesByDay } from '@/api';
import type { Sale, SalesByDay } from '@/api/types';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radius } from '@/theme';
import { formatMoney } from '@/utils/format';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SalesScreen() {
  const insets = useSafeAreaInsets();
  const [days, setDays] = useState<SalesByDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSalesByDay()
      .then(setDays)
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
      <SectionList
        sections={days.map((day) => ({ title: sectionTitle(day.date), data: day.sales }))}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Sales" />
            <Pressable style={styles.addButton} onPress={() => router.push('/add-sales')}>
              <Icon name="plusBtn" color="#fff" width={18} height={14} />
              <Text style={styles.addButtonText}>Add Sale</Text>
            </Pressable>
          </>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => <SaleCard sale={item} />}
      />
    </View>
  );
}

function SaleCard({ sale }: { sale: Sale }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Icon name="tabProducts" color="#BDBDBD" width={34} height={38} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{sale.productName}</Text>
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyText}>×{sale.quantity}</Text>
          </View>
        </View>
        <Text style={styles.time}>{formatTime(sale.timestamp)}</Text>
      </View>
      <Text style={styles.amount}>{formatMoney(sale.amount)}</Text>
    </View>
  );
}

function sectionTitle(date: string): string {
  const day = new Date(`${date}T00:00:00`);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (day.toDateString() === today.toDateString()) return 'Today';
  if (day.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return day.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: colors.danger, textAlign: 'center' },
  list: { paddingHorizontal: 22, paddingBottom: 32 },

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

  sectionHeader: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 14,
    minHeight: 85,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 20, fontFamily: fonts.semiBold, color: colors.text },
  qtyBadge: {
    borderWidth: 1.5,
    borderColor: colors.text,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  qtyText: { fontSize: 13, fontFamily: fonts.regular, color: colors.text },
  time: { fontSize: 15, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 4 },
  amount: { fontSize: 20, fontFamily: fonts.regular, color: colors.text, marginLeft: 12 },
});
