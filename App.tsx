import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CalculatorScreen from './src/screens/CalculatorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {
  deleteBill,
  loadBills,
  loadSettings,
  saveSettings,
} from './src/storage';
import { colors, spacing } from './src/theme';
import { Bill, DEFAULT_SETTINGS, Settings } from './src/types';

type Tab = 'calculator' | 'history' | 'settings';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'calculator', label: 'חישוב', icon: '🧮' },
  { key: 'history', label: 'היסטוריה', icon: '📜' },
  { key: 'settings', label: 'הגדרות', icon: '⚙️' },
];

const TAB_TITLES: Record<Tab, string> = {
  calculator: 'חשבון חשמל לרכב',
  history: 'מעקב חשבונות',
  settings: 'הגדרות',
};

export default function App() {
  const [tab, setTab] = useState<Tab>('calculator');
  const [bills, setBills] = useState<Bill[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [loadedBills, loadedSettings] = await Promise.all([
        loadBills(),
        loadSettings(),
      ]);
      setBills(loadedBills);
      setSettings(loadedSettings);
      setLoading(false);
    })();
  }, []);

  const refreshBills = async () => {
    setBills(await loadBills());
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteBill(id);
    setBills(updated);
  };

  const handleSaveSettings = async (next: Settings) => {
    setSettings(next);
    await saveSettings(next);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* כותרת עליונה */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TAB_TITLES[tab]}</Text>
      </View>

      {/* תוכן המסך */}
      <View style={styles.content}>
        {tab === 'calculator' && (
          <CalculatorScreen
            settings={settings}
            lastBill={bills.length > 0 ? bills[0] : null}
            onBillAdded={refreshBills}
          />
        )}
        {tab === 'history' && (
          <HistoryScreen
            bills={bills}
            settings={settings}
            onDelete={handleDelete}
          />
        )}
        {tab === 'settings' && (
          <SettingsScreen settings={settings} onSave={handleSaveSettings} />
        )}
      </View>

      {/* ניווט תחתון */}
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
                {t.icon}
              </Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
