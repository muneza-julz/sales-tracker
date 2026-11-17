import { colors, fonts, radius } from '@/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/** Back arrow + screen title, matching the Add * pages in Figma. */
export function BackHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="arrow-back" size={26} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

/** Label above a rounded input box, per the Figma form style. */
export function FormField({
  label,
  error,
  ...inputProps
}: { label: string; error?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
      <ErrorText message={error} />
    </View>
  );
}

/** Red validation message shown under a field (inputs and pickers). */
export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.errorText}>{message}</Text>;
}

/** Red border style for picker rows that act like inputs. */
export function pickerErrorStyle(hasError: boolean) {
  return hasError ? styles.inputError : null;
}

/** Blue SAVE button used at the bottom of the Add * forms. */
export function SaveButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      style={[styles.saveButton, (disabled || loading) && styles.saveButtonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.saveLabel}>{loading ? 'SAVING…' : label}</Text>
    </Pressable>
  );
}

/** Centered modal list used for product/category pickers. */
export function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: { label: string; subtitle?: string; value: string }[];
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <ModalShell visible={visible} onClose={onClose} title={title}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={styles.option}
          onPress={() => {
            onSelect(option.value);
            onClose();
          }}
        >
          <Text style={styles.optionLabel}>{option.label}</Text>
          {option.subtitle ? <Text style={styles.optionSub}>{option.subtitle}</Text> : null}
        </Pressable>
      ))}
    </ModalShell>
  );
}

function ModalShell({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 320 }}>{children}</ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  title: { fontSize: 25, fontFamily: fonts.regular, color: colors.text },

  field: { marginBottom: 26 },
  label: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 4,
    fontFamily: fonts.regular,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 5,
    paddingHorizontal: 19,
    fontSize: 18,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: 'rgba(217,217,217,0.15)',
  },

  saveButton: {
    height: 52,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveLabel: { fontSize: 20, fontFamily: fonts.semiBold, color: '#fff' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: radius.card,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: { fontSize: 20, fontFamily: fonts.semiBold, marginBottom: 12, color: colors.text },
  option: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionLabel: { fontSize: 17, fontFamily: fonts.regular, color: colors.text },
  optionSub: { fontSize: 13, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 2 },
});
