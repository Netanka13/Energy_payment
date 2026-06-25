import { Bill, Settings } from './types';

/** ברירת המחדל של התעריף לקוט"ש (שקלים) */
export const DEFAULT_RATE = 0.68;

/**
 * חישוב סכום החשבון לפי הנוסחה:
 * (קריאה נוכחית - קריאה קודמת) * תעריף = חשבון
 */
export function calculateAmount(
  previousReading: number,
  currentReading: number,
  rate: number = DEFAULT_RATE
): number {
  const consumption = currentReading - previousReading;
  const amount = consumption * rate;
  // עיגול לשתי ספרות אחרי הנקודה
  return Math.round(amount * 100) / 100;
}

/** עיצוב מספר להצגה — מסיר אפסים מיותרים בסוף */
export function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value
    .toFixed(2)
    .replace(/\.?0+$/, '');
}

/** עיצוב סכום כספי בשקלים */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)} ₪`;
}

/**
 * יצירת טקסט פירוט החשבון להעתקה, בפורמט המבוקש:
 *
 * <שם משתמש> — פרוט חשבון חשמל
 *
 * תשלום חשבון מונה עבור <כתובת>
 *
 * קריאה קודמת - x
 * קריאה נוכחית - y
 *
 * סהכ הועברו z שקלים
 */
export function buildBillText(bill: Bill, settings: Settings): string {
  const name = settings.userName.trim() || 'משתמש';
  const address = settings.address.trim() || 'כתובת לא הוזנה';

  const lines = [
    `${name} — פרוט חשבון חשמל`,
    '',
    `תשלום חשבון מונה עבור ${address}`,
    '',
    `קריאה קודמת - ${formatNumber(bill.previousReading)}`,
    `קריאה נוכחית - ${formatNumber(bill.currentReading)}`,
    '',
    `סהכ הועברו ${formatNumber(bill.amount)} שקלים`,
  ];

  return lines.join('\n');
}

/** עיצוב תאריך לתצוגה בעברית */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
