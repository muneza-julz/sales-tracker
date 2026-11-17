import { createSale, getProducts } from '@/api';
import type { PaymentMethod, Product } from '@/api/types';
import { AlertDialog } from '@/components/AlertDialog';
import {
  BackHeader,
  ErrorText,
  FormField,
  PickerModal,
  pickerErrorStyle,
  SaveButton,
} from '@/components/FormControls';
import { colors, fonts } from '@/theme';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
];

export default function AddSalesScreen() {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ product?: string; quantity?: string }>({});

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load products'));
  }, []);

  const validate = () => {
    const next: typeof errors = {};
    if (!product) next.product = 'Please select a product.';
    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      next.quantity = 'Quantity must be a number greater than 0.';
    } else if (product && qty > product.stock) {
      next.quantity = `Only ${product.stock} in stock.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    const qty = Number(quantity);
    setSaving(true);
    try {
      await createSale({ productId: product!.id, quantity: qty, paymentMethod });
      router.replace('/success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save sale');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <BackHeader title="Add Sale" />

      <View style={styles.field}>
        <Text style={styles.label}>Product</Text>
        <Pressable
          style={[styles.pickerField, pickerErrorStyle(!!errors.product)]}
          onPress={() => setProductPickerOpen(true)}
        >
          <Text style={[styles.pickerText, !product && styles.pickerPlaceholder]}>
            {product ? `${product.name} (stock: ${product.stock})` : 'Select Product'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        <ErrorText message={errors.product} />
      </View>

      <FormField
        label="Quantity"
        placeholder="Enter quantity"
        keyboardType="number-pad"
        value={quantity}
        error={errors.quantity}
        onChangeText={(text) => {
          setQuantity(text);
          if (errors.quantity) setErrors((e) => ({ ...e, quantity: undefined }));
        }}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.toggleRow}>
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.value;
            return (
              <Pressable
                key={method.value}
                style={[styles.toggleOption, selected && styles.toggleOptionSelected]}
                onPress={() => setPaymentMethod(method.value)}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.toggleLabel, selected && styles.toggleLabelSelected]}>
                  {method.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SaveButton label="SAVE SALE" onPress={save} loading={saving} />

      <PickerModal
        visible={productPickerOpen}
        title="Select Product"
        options={products.map((p) => ({
          label: p.name,
          subtitle: `Stock: ${p.stock} · ${p.sellingPrice.toLocaleString()} RWF`,
          value: String(p.id),
        }))}
        onSelect={(value) => {
          const next = products.find((p) => String(p.id) === value) ?? null;
          setProduct(next);
          if (errors.product) setErrors((e) => ({ ...e, product: undefined }));
        }}
        onClose={() => setProductPickerOpen(false)}
      />
      <AlertDialog
        visible={!!error}
        title="Error"
        message={error ?? ''}
        onClose={() => setError(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 22, paddingBottom: 40 },
  field: { marginBottom: 26 },
  label: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 10,
  },
  pickerField: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 5,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(217,217,217,0.15)',
  },
  pickerText: { fontSize: 18, fontFamily: fonts.regular, color: colors.text, flex: 1 },
  pickerPlaceholder: { color: colors.textMuted },
  chevron: { fontSize: 16, color: colors.text },

  toggleRow: { flexDirection: 'row', gap: 14 },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(217,217,217,0.15)',
  },
  toggleOptionSelected: { borderColor: colors.primary, backgroundColor: '#EAF4FF' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  toggleLabel: { fontSize: 16, fontFamily: fonts.regular, color: colors.text },
  toggleLabelSelected: { color: colors.primary, fontFamily: fonts.semiBold },
});
