import { getProducts } from '@/api';
import type { Product } from '@/api/types';
import { AlertDialog } from '@/components/AlertDialog';
import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radius } from '@/theme';
import { formatMoney } from '@/utils/format';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProducts()
        .then(setProducts)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
        .finally(() => setLoading(false));
    }, [])
  );

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
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Products" />
            <Pressable style={styles.addButton} onPress={() => router.push('/add-products')}>
              <Icon name="plusBtn" color="#fff" width={18} height={14} />
              <Text style={styles.addButtonText}>Add product</Text>
            </Pressable>
          </>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [detailOpen, setDetailOpen] = useState(false);
  return (
    <Pressable style={styles.card} onPress={() => setDetailOpen(true)}>
      <View style={styles.thumb}>
        <Icon name="tabProducts" color="#BDBDBD" width={44} height={48} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.stock}>Stock: {product.stock}</Text>
        <Text style={styles.priceRow}>
          price: <Text style={styles.price}>{formatMoney(product.sellingPrice)}</Text>
        </Text>
        {product.lowStock && (
          <Text style={styles.lowStock}>Low stock ({product.stock} left)</Text>
        )}
      </View>
      <Icon name="more" color="#000" width={8} height={28} />
      <AlertDialog
        visible={detailOpen}
        title={product.name}
        message={`Category: ${product.category}\nCost: ${formatMoney(product.costPrice)}\nSelling: ${formatMoney(product.sellingPrice)}\nStock: ${product.stock}${product.lowStock ? ' (low)' : ''}`}
        onClose={() => setDetailOpen(false)}
      />
    </Pressable>
  );
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
    marginBottom: 22,
  },
  addButtonText: { color: '#fff', fontSize: 20, fontFamily: fonts.regular },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    minHeight: 110,
  },
  thumb: {
    width: 76,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  info: { flex: 1 },
  name: { fontSize: 22, fontFamily: fonts.semiBold, color: colors.text },
  stock: { fontSize: 15, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 4 },
  priceRow: { fontSize: 15, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },
  price: { color: colors.primary },
  lowStock: { fontSize: 15, fontFamily: fonts.regular, color: colors.primary, marginTop: 4 },
});
