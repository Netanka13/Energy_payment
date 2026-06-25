import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buildBillText, formatCurrency, formatNumber } from '../calc';
import { colors, radius, shadow, spacing } from '../theme';
import { Bill, Settings } from '../types';

interface Props {
  bill: Bill;
  settings: Settings;
}

/**
 * תצוגה ויזואלית של טקסט החשבון להעתקה, עם כפתור "העתק".
 * מציגה בדיוק את הטקסט שיועתק ללוח.
 */
export default function BillPreview({ bill, settings }: Props) {
  const [copied, setCopied] = useState(false);
  const name = settings.userName.trim() || 'משתמש';
  const address = settings.address.trim() || 'כתובת לא הוזנה';

  const handleCopy = async () => {
    const text = buildBillText(bill, settings);
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* תצוגה מעוצבת כמו "פתק" של הודעה */}
      <View style={styles.note}>
        <Text style={styles.title}>{name} — פרוט חשבון חשמל</Text>

        <Text style={styles.line}>תשלום חשבון מונה עבור {address}</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>קריאה קודמת</Text>
          <Text style={styles.value}>{formatNumber(bill.previousReading)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>קריאה נוכחית</Text>
          <Text style={styles.value}>{formatNumber(bill.currentReading)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>סה"כ הועברו</Text>
          <Text style={styles.totalValue}>{formatCurrency(bill.amount)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.copyButton, copied && styles.copyButtonDone]}
        onPress={handleCopy}
        activeOpacity={0.8}
      >
        <Text style={styles.copyButtonText}>
          {copied ? '✓ הטקסט הועתק!' : '📋 העתק פירוט חשבון'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  note: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  line: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 15,
    color: colors.textMuted,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  copyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  copyButtonDone: {
    backgroundColor: colors.success,
  },
  copyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
