import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { DEFAULT_RATE } from '../calc';
import { colors, radius, shadow, spacing } from '../theme';
import { Settings } from '../types';

interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export default function SettingsScreen({ settings, onSave }: Props) {
  const [userName, setUserName] = useState(settings.userName);
  const [address, setAddress] = useState(settings.address);
  const [rate, setRate] = useState(settings.rate.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    Keyboard.dismiss();
    const parsedRate = parseFloat(rate);
    onSave({
      userName: userName.trim(),
      address: address.trim(),
      rate: isNaN(parsedRate) || parsedRate <= 0 ? DEFAULT_RATE : parsedRate,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>פרטים אישיים</Text>
            <Text style={styles.cardSubtitle}>
              הפרטים האלה מופיעים בטקסט שמועתק עבור כל חשבון
            </Text>

            <Text style={styles.inputLabel}>שם משתמש</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="לדוגמה: דני כהן"
              placeholderTextColor={colors.textMuted}
              textAlign="right"
            />

            <Text style={styles.inputLabel}>כתובת המונה</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="לדוגמה: רחוב הרצל 5, תל אביב"
              placeholderTextColor={colors.textMuted}
              textAlign="right"
            />

            <Text style={styles.inputLabel}>תעריף לקוט"ש (₪)</Text>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
              placeholder="0.68"
              placeholderTextColor={colors.textMuted}
              textAlign="right"
            />
            <Text style={styles.hint}>
              ברירת מחדל: {DEFAULT_RATE} ₪ לקוט"ש
            </Text>

            <TouchableOpacity
              style={[styles.button, saved && styles.buttonSaved]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {saved ? '✓ נשמר' : 'שמור הגדרות'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>אודות</Text>
            <Text style={styles.aboutText}>
              אפליקציה למעקב וחישוב תשלום חשבון חשמל לטעינת רכב חשמלי.
              החישוב מתבצע לפי הנוסחה: (קריאה נוכחית − קריאה קודמת) × תעריף.
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  buttonSaved: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  aboutCard: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    lineHeight: 20,
  },
});
