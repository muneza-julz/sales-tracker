import { ICONS } from '@/icons';
import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/theme';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const TAB_ICONS = {
  index: 'tabHome',
  sales: 'tabSales',
  products: 'tabProducts',
  expenses: 'tabExpenses',
} as const;

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
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#000000',
          tabBarLabelStyle: { fontFamily: fonts.regular, fontSize: 15 },
          tabBarIcon: ({ color, focused }) => {
            const name = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
            if (!name) return null;
            const icon = ICONS[name];
            return (
              <Icon
                name={name}
                color={focused ? colors.primary : '#000000'}
                width={icon.width}
                height={icon.height}
              />
            );
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="sales" options={{ title: 'sales' }} />
        <Tabs.Screen name="products" options={{ title: 'products' }} />
        <Tabs.Screen name="expenses" options={{ title: 'expenses' }} />
        <Tabs.Screen name="add-products" options={{ href: null, title: 'Add Product' }} />
        <Tabs.Screen name="add-sales" options={{ href: null, title: 'Add Sale' }} />
        <Tabs.Screen name="add-expenses" options={{ href: null, title: 'Add Expense' }} />
      </Tabs>
    </>
  );
}
