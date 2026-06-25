import AsyncStorage from '@react-native-async-storage/async-storage';

import { Bill, DEFAULT_SETTINGS, Settings } from './types';

const BILLS_KEY = '@energy_payment/bills';
const SETTINGS_KEY = '@energy_payment/settings';

/** טעינת כל החשבונות מההיסטוריה (מהחדש לישן) */
export async function loadBills(): Promise<Bill[]> {
  try {
    const raw = await AsyncStorage.getItem(BILLS_KEY);
    if (!raw) return [];
    const bills: Bill[] = JSON.parse(raw);
    return bills.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e) {
    console.warn('שגיאה בטעינת חשבונות', e);
    return [];
  }
}

/** שמירת רשימת החשבונות המלאה */
export async function saveBills(bills: Bill[]): Promise<void> {
  await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(bills));
}

/** הוספת חשבון חדש והחזרת הרשימה המעודכנת */
export async function addBill(bill: Bill): Promise<Bill[]> {
  const bills = await loadBills();
  const updated = [bill, ...bills];
  await saveBills(updated);
  return updated;
}

/** מחיקת חשבון לפי מזהה */
export async function deleteBill(id: string): Promise<Bill[]> {
  const bills = await loadBills();
  const updated = bills.filter((b) => b.id !== id);
  await saveBills(updated);
  return updated;
}

/** טעינת הגדרות המשתמש */
export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('שגיאה בטעינת הגדרות', e);
    return DEFAULT_SETTINGS;
  }
}

/** שמירת הגדרות המשתמש */
export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
