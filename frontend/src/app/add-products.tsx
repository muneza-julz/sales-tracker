import { createProduct } from '@/api';
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
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  'Groceries',
  'Bakery',
  'Dairy',
  'Beverages',
  'Household',
  'Other',
];

type FieldErrors = {
  name?: string;
  category?: string;
  costPrice?: string;
  sellingPrice?: string;
  stock?: string;
};

export default function AddProductsScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = () => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = 'Product name is required.';
    if (!category) next.category = 'Please select a category.';
    const cost = Number(costPrice);
    const price = Number(sellingPrice);
    const qty = Number(stock);
    if (!costPrice || isNaN(cost) || cost < 0) {
      next.costPrice = 'Enter a valid cost price.';
    }
    if (!sellingPrice || isNaN(price) || price <= 0) {
      next.sellingPrice = 'Enter a valid selling price.';
    }
    if (!stock || isNaN(qty) || qty < 0) {
      next.stock = 'Enter a valid stock quantity.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createProduct({
        name: name.trim(),
        category,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        stock: Number(stock),
      });
      router.replace('/success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save product');
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
      <BackHeader title="Add Product" />

      <FormField
        label="Product Name"
        placeholder="Enter product name"
        value={name}
        error={errors.name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
        }}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <Pressable
          style={[styles.pickerField, pickerErrorStyle(!!errors.category)]}
          onPress={() => setCategoryPickerOpen(true)}
        >
          <Text style={[styles.pickerText, !category && styles.pickerPlaceholder]}>
            {category || 'Select Category'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        <ErrorText message={errors.category} />
      </View>

      <FormField
        label="Cost Price"
        placeholder="Enter cost price"
        keyboardType="number-pad"
        value={costPrice}
        error={errors.costPrice}
        onChangeText={(text) => {
          setCostPrice(text);
          if (errors.costPrice) setErrors((e) => ({ ...e, costPrice: undefined }));
        }}
      />
      <FormField
        label="Selling Price"
        placeholder="Enter Selling Price"
        keyboardType="number-pad"
        value={sellingPrice}
        error={errors.sellingPrice}
        onChangeText={(text) => {
          setSellingPrice(text);
          if (errors.sellingPrice) setErrors((e) => ({ ...e, sellingPrice: undefined }));
        }}
      />
      <FormField
        label="Stock Quantity"
        placeholder="Enter Stock Quantity"
        keyboardType="number-pad"
        value={stock}
        error={errors.stock}
        onChangeText={(text) => {
          setStock(text);
          if (errors.stock) setErrors((e) => ({ ...e, stock: undefined }));
        }}
      />

      <SaveButton label="SAVE PRODUCT" onPress={save} loading={saving} />

      <PickerModal
        visible={categoryPickerOpen}
        title="Select Category"
        options={CATEGORIES.map((c) => ({ label: c, value: c }))}
        onSelect={(value) => {
          setCategory(value);
          if (errors.category) setErrors((e) => ({ ...e, category: undefined }));
        }}
        onClose={() => setCategoryPickerOpen(false)}
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
  pickerText: { fontSize: 18, fontFamily: fonts.regular, color: colors.text },
  pickerPlaceholder: { color: colors.textMuted },
  chevron: { fontSize: 16, color: colors.text },
});
