import { ICONS } from '@/icons';
import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/theme';
import { Tabs } from 'expo-router';

const TAB_ICONS = {
  index: 'tabHome',
  sales: 'tabSales',
  products: 'tabProducts',
  expenses: 'tabExpenses',
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#000000',
        tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: 15 },
        tabBarIcon: ({ focused }) => {
          const name = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          if (!name) return null;
          return (
            <Icon
              name={name}
              color={focused ? colors.primary : '#000000'}
              width={ICONS[name].width}
              height={ICONS[name].height}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="sales" options={{ title: 'sales' }} />
      <Tabs.Screen name="products" options={{ title: 'products' }} />
      <Tabs.Screen name="expenses" options={{ title: 'expenses' }} />
    </Tabs>
  );
}
