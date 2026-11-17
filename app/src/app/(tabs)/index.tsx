import { getSummary, getWeeklySummary } from '@/api';
import type { Summary } from '@/api/types';
import { AlertDialog } from '@/components/AlertDialog';
import { Icon } from '@/components/Icon';
import { colors, fonts, radius } from '@/theme';
import { formatMoney } from '@/utils/format';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [today, setToday] = useState<Summary | null>(null);
  const [week, setWeek] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const fetchData = useCallback(
    () => Promise.all([getSummary(), getWeeklySummary()]),
    []
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetchData()
        .then(([summary, weekly]) => {
          if (cancelled) return;
          setToday(summary);
          setWeek(weekly);
          setError(null);
        })
        .catch((e) => {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : 'Failed to load summary');
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData()
      .then(([summary, weekly]) => {
        setToday(summary);
        setWeek(weekly);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load summary'))
      .finally(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !today) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.error}>{error ?? 'No data'}</Text>
        <Text style={styles.retry} onPress={onRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ paddingTop: insets.top }}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Icon name="logo" width={30} height={28} />
        <View style={styles.headerText}>
          <Text style={styles.shopName}>My Shop</Text>
          <Text style={styles.date}>{formatDate(today.date)}</Text>
        </View>
        <Pressable onPress={() => setNotifyOpen(true)} hitSlop={12}>
          <Icon name="headerIcon" color="#000" width={20} height={20} />
        </Pressable>
      </View>

      {/* Stat cards */}
      <StatCard
        icon="cart"
        iconBg={colors.primary}
        bg={colors.cardAlt}
        label="sales today"
        labelColor={colors.primary}
        value={today.sales}
      />
      <StatCard
        icon="transaction"
        iconBg="#000"
        bg={colors.card}
        label="expenses today"
        labelColor={colors.text}
        value={today.expenses}
      />
      <StatCard
        icon="statistics"
        iconBg="#000"
        bg={colors.card}
        label="profit today"
        labelColor={colors.text}
        value={today.profit}
      />

      {/* Weekly overview */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Overview</Text>
        <WeeklyChart week={week} />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <ActionButton
          label="Add Sales"
          icon="plusWhite"
          filled
          onPress={() => router.push('/add-sales')}
        />
        <ActionButton
          label="Add Expenses"
          icon="plusBlue"
          onPress={() => router.push('/add-expenses')}
        />
      </View>
      <AlertDialog
        visible={notifyOpen}
        title="Notifications"
        message="Notifications are not available yet."
        onClose={() => setNotifyOpen(false)}
      />
    </ScrollView>
  );
}

function StatCard({
  icon,
  iconBg,
  bg,
  label,
  labelColor,
  value,
}: {
  icon: 'cart' | 'transaction' | 'statistics';
  iconBg: string;
  bg: string;
  label: string;
  labelColor: string;
  value: number;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.iconBadge, { backgroundColor: iconBg }]}>
        <Icon name={icon} color="#fff" width={20} height={20} />
      </View>
      <View style={styles.statText}>
        <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
        <Text style={styles.statValue}>{formatMoney(value)}</Text>
      </View>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  filled,
  onPress,
}: {
  label: string;
  icon: 'plusWhite' | 'plusBlue';
  filled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.actionButton, filled ? styles.actionFilled : styles.actionOutline]}
      onPress={onPress}
    >
      <Icon name={icon} width={16} height={14} />
      <Text style={[styles.actionLabel, filled && styles.actionLabelFilled]}>{label}</Text>
    </Pressable>
  );
}

function WeeklyChart({ week }: { week: Summary[] }) {
  const values = week.flatMap((d) => [d.sales, d.profit]);
  const rawMax = Math.max(1, ...values);
  const axisMax = Math.max(10000, Math.ceil(rawMax / 10000) * 10000);
  const ticks = [0, 1, 2, 3, 4].map((i) => (axisMax / 4) * i);

  return (
    <View>
      {/* legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>sales</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: colors.chartBar }]} />
          <Text style={styles.legendText}>profit</Text>
        </View>
      </View>

      <View style={styles.chartRow}>
        {/* y axis labels */}
        <View style={styles.yAxis}>
          {[...ticks].reverse().map((t) => (
            <Text key={t} style={styles.yLabel}>
              {t === 0 ? '0' : `${t / 1000}k`}
            </Text>
          ))}
        </View>

        {/* plot */}
        <View style={styles.plot}>
          {ticks.map((t) => (
            <View
              key={t}
              style={[
                styles.gridLine,
                { bottom: `${(t / axisMax) * 100}%` },
              ]}
            />
          ))}
          <View style={styles.bars}>
            {week.map((day) => (
              <View key={day.date} style={styles.dayCol}>
                <View style={styles.barPair}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(day.sales / axisMax) * 100}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(day.profit / axisMax) * 100}%`,
                        backgroundColor: colors.chartBar,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* day labels */}
      <View style={styles.dayLabels}>
        {week.map((day) => (
          <Text key={day.date} style={styles.dayLabel}>
            {dayName(day.date)}
          </Text>
        ))}
      </View>
    </View>
  );
}

function dayName(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: colors.danger, textAlign: 'center' },
  retry: { marginTop: 12, color: colors.primary },
  content: { paddingHorizontal: 22, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerText: { marginLeft: 14, flex: 1 },
  shopName: { fontSize: 24, fontFamily: fonts.semiBold, color: colors.text },
  date: { fontSize: 15, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },

  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  iconBadge: {
    width: 44,
    height: 34,
    borderRadius: radius.iconBadge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: { marginLeft: 18, flex: 1 },
  statLabel: { fontSize: 15, fontFamily: fonts.regular },
  statValue: { fontSize: 25, fontFamily: fonts.regular, color: colors.text, marginTop: 4 },

  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 20, fontFamily: fonts.regular, color: colors.text, marginBottom: 12 },
  legend: { flexDirection: 'row', gap: 28, marginBottom: 8, marginLeft: 44 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendSquare: { width: 15, height: 15, borderRadius: 2 },
  legendText: { fontSize: 15, fontFamily: fonts.regular, color: colors.text },
  chartRow: { flexDirection: 'row' },
  yAxis: { width: 40, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 8 },
  yLabel: { fontSize: 13, fontFamily: fonts.regular, color: colors.text },
  plot: { flex: 1, height: 140 },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.borderStrong,
  },
  bars: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dayCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: '100%', justifyContent: 'flex-end' },
  bar: { width: 12, borderRadius: 2, minHeight: 2 },
  dayLabels: { flexDirection: 'row', marginTop: 8, marginLeft: 40 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 15, fontFamily: fonts.regular, color: colors.text },

  actions: { flexDirection: 'row', gap: 16 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: radius.button,
  },
  actionFilled: { backgroundColor: colors.primary },
  actionOutline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionLabel: { fontSize: 18, fontFamily: fonts.regular, color: colors.primary },
  actionLabelFilled: { color: '#fff' },
});
