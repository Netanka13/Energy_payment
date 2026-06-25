import React, { useEffect, useState } from 'react';
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

import BillPreview from '../components/BillPreview';
import { calculateAmount, formatCurrency, formatNumber } from '../calc';
import { addBill } from '../storage';
import { colors, radius, shadow, spacing } from '../theme';
import { Bill, Settings } from '../types';

interface Props {
  settings: Settings;
  lastBill: Bill | null;
  onBillAdded: () => void;
}

export default function CalculatorScreen({ settings, lastBill, onBillAdded }: Props) {
  const [previous, setPrevious] = useState('');
  const [current, setCurrent] = useState('');
  const [error, setError] = useState('');
  const [savedBill, setSavedBill] = useState<Bill | null>(null);

  // מילוי אוטומטי של הקריאה הקודמת מהחשבון האחרון
  useEffect(() => {
    if (lastBill) {
      setPrevious(formatNumber(lastBill.currentReading));
    }
  }, [lastBill]);

  const prevNum = parseFloat(previous);
  const currNum = parseFloat(current);
  const validInputs =
    !isNaN(prevNum) && !isNaN(currNum) && current.trim() !== '' && previous.trim() !== '';

  // תצוגה מקדימה חיה של הסכום
  const livePreview =
    validInputs && currNum >= prevNum
      ? calculateAmount(prevNum, currNum, settings.rate)
      : null;

  const handleCalculate = async () => {
    Keyboard.dismiss();
    setError('');

    if (!validInputs) {
      setError('יש להזין קריאה קודמת ונוכחית (מספרים בלבד)');
      return;
    }
    if (currNum < prevNum) {
      setError('הקריאה הנוכחית חייבת להיות גדולה או שווה לקריאה הקודמת');
      return;
    }

    const amount = calculateAmount(prevNum, currNum, settings.rate);
    const bill: Bill = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      previousReading: prevNum,
      currentReading: currNum,
      rate: settings.rate,
      amount,
      consumption: Math.round((currNum - prevNum) * 100) / 100,
      createdAt: new Date().toISOString(),
    };

    await addBill(bill);
    setSavedBill(bill);
    setCurrent('');
    onBillAdded();
  };

  const handleNewBill = () => {
    setSavedBill(null);
    if (savedBill) {
      setPrevious(formatNumber(savedBill.currentReading));
    }
    setCurrent('');
    setError('');
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
          {savedBill ? (
            // ---- מצב: חשבון נשמר, מציגים פירוט להעתקה ----
            <View>
              <Text style={styles.successBanner}>✓ החשבון נשמר בהצלחה</Text>
              <BillPreview bill={savedBill} settings={settings} />
              <TouchableOpacity style={styles.secondaryButton} onPress={handleNewBill}>
                <Text style={styles.secondaryButtonText}>+ חשבון חדש</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // ---- מצב: הזנת קריאות ----
            <View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>חישוב חשבון חשמל</Text>
                <Text style={styles.cardSubtitle}>
                  תעריף: {formatCurrency(settings.rate)} לקוט"ש
                </Text>

                <Text style={styles.inputLabel}>קריאה קודמת</Text>
                <TextInput
                  style={styles.input}
                  value={previous}
                  onChangeText={setPrevious}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  textAlign="right"
                />

                <Text style={styles.inputLabel}>קריאה נוכחית</Text>
                <TextInput
                  style={styles.input}
                  value={current}
                  onChangeText={setCurrent}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  textAlign="right"
                />

                {livePreview !== null && (
                  <View style={styles.livePreview}>
                    <Text style={styles.livePreviewLabel}>סכום משוער</Text>
                    <Text style={styles.livePreviewValue}>
                      {formatCurrency(livePreview)}
                    </Text>
                  </View>
                )}

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                  <Text style={styles.buttonText}>חשב ושמור חשבון</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>
                  ( קריאה נוכחית − קריאה קודמת ) × {formatNumber(settings.rate)} = חשבון
                </Text>
              </View>
            </View>
          )}
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
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.background,
  },
  livePreview: {
    marginTop: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePreviewLabel: {
    fontSize: 15,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  livePreviewValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'right',
    marginTop: spacing.md,
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  successBanner: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  formulaBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  formulaText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
