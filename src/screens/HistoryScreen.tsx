import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BillPreview from '../components/BillPreview';
import { buildBillText, formatCurrency, formatDate, formatNumber } from '../calc';
import { colors, radius, shadow, spacing } from '../theme';
import { Bill, Settings } from '../types';

interface Props {
  bills: Bill[];
  settings: Settings;
  onDelete: (id: string) => void;
}

export default function HistoryScreen({ bills, settings, onDelete }: Props) {
  const [selected, setSelected] = useState<Bill | null>(null);

  const handleQuickCopy = async (bill: Bill) => {
    const text = buildBillText(bill, settings);
    await Clipboard.setStringAsync(text);
    Alert.alert('הועתק', 'פירוט החשבון הועתק ללוח');
  };

  const handleDelete = (bill: Bill) => {
    Alert.alert('מחיקת חשבון', 'האם למחוק את החשבון הזה?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: () => onDelete(bill.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Bill }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelected(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.readingsRow}>
        <Text style={styles.reading}>
          קודמת: {formatNumber(item.previousReading)}
        </Text>
        <Text style={styles.reading}>
          נוכחית: {formatNumber(item.currentReading)}
        </Text>
        <Text style={styles.reading}>
          צריכה: {formatNumber(item.consumption)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleQuickCopy(item)}
        >
          <Text style={styles.actionText}>📋 העתק</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[styles.actionText, styles.deleteText]}>🗑 מחק</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.flex}>
      {bills.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔌</Text>
          <Text style={styles.emptyText}>אין עדיין חשבונות</Text>
          <Text style={styles.emptySubtext}>
            חשבונות שתחשב יופיעו כאן למעקב
          </Text>
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* חלון תצוגת פירוט מלא + העתקה */}
      <Modal
        visible={selected !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>פירוט החשבון</Text>
            {selected && <BillPreview bill={selected} settings={settings} />}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelected(null)}
            >
              <Text style={styles.closeButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
  },
  readingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  reading: {
    fontSize: 13,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  deleteText: {
    color: colors.danger,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
