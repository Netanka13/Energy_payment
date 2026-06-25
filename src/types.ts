// טיפוסים מרכזיים של האפליקציה

/** רשומת חשבון חשמל בודדת בהיסטוריה */
export interface Bill {
  /** מזהה ייחודי */
  id: string;
  /** קריאת המונה הקודמת */
  previousReading: number;
  /** קריאת המונה הנוכחית */
  currentReading: number;
  /** תעריף לקוט"ש (ברירת מחדל 0.68) */
  rate: number;
  /** סכום החשבון בשקלים */
  amount: number;
  /** מספר הקוט"ש שנצרכו (currentReading - previousReading) */
  consumption: number;
  /** חותמת זמן ISO של מועד יצירת החשבון */
  createdAt: string;
}

/** הגדרות המשתמש */
export interface Settings {
  /** שם המשתמש שמופיע בטקסט ההעתקה */
  userName: string;
  /** כתובת המונה */
  address: string;
  /** תעריף ברירת מחדל לקוט"ש */
  rate: number;
}

export const DEFAULT_SETTINGS: Settings = {
  userName: '',
  address: '',
  rate: 0.68,
};
