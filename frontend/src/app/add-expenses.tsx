import { createExpense } from '@/api';
import type { ExpenseCategory } from '@/api/types';
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

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'RENT', label: 'Rent' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'OTHERS', label: 'Others' },
];

type FieldErrors = {
  title?: string;
  amount?: string;
  category?: string;
};

export default function AddExpensesScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = () => {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = 'Title is required.';
    const value = Number(amount);
    if (!amount || isNaN(value) || value <= 0) {
      next.amount = 'Amount must be a number greater than 0.';
    }
    if (!category) next.category = 'Please select a category.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createExpense({
        title: title.trim(),
        amount: Number(amount),
        category: category!,
      });
      router.replace('/success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save expense');
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
      <BackHeader title="Add Expenses" />

      <FormField
        label="Title"
        placeholder="Enter expense title"
        value={title}
        error={errors.title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
        }}
      />
      <FormField
        label="Amount"
        placeholder="Enter amount"
        keyboardType="number-pad"
        value={amount}
        error={errors.amount}
        onChangeText={(text) => {
          setAmount(text);
          if (errors.amount) setErrors((e) => ({ ...e, amount: undefined }));
        }}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <Pressable
          style={[styles.pickerField, pickerErrorStyle(!!errors.category)]}
          onPress={() => setCategoryPickerOpen(true)}
        >
          <Text style={[styles.pickerText, !category && styles.pickerPlaceholder]}>
            {category ? CATEGORIES.find((c) => c.value === category)?.label : 'Select Category'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        <ErrorText message={errors.category} />
      </View>

      <SaveButton label="SAVE EXPENSE" onPress={save} loading={saving} />

      <PickerModal
        visible={categoryPickerOpen}
        title="Select Category"
        options={CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
        onSelect={(value) => {
          setCategory(value as ExpenseCategory);
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
