import { User } from '../models/User'

export const WILAYA_NUMBERS: Record<string, number> = {
  'أدرار': 1, 'الشلف': 2, 'الأغواط': 3, 'أم البواقي': 4, 'باتنة': 5,
  'بجاية': 6, 'بسكرة': 7, 'بشار': 8, 'البليدة': 9, 'البويرة': 10,
  'تمنراست': 11, 'تبسة': 12, 'تلمسان': 13, 'تيارت': 14, 'تيزي وزو': 15,
  'الجزائر': 16, 'الجلفة': 17, 'جيجل': 18, 'سطيف': 19, 'سعيدة': 20,
  'سكيكدة': 21, 'سيدي بلعباس': 22, 'عنابة': 23, 'قالمة': 24, 'قسنطينة': 25,
  'المدية': 26, 'مستغانم': 27, 'المسيلة': 28, 'معسكر': 29, 'ورقلة': 30,
  'وهران': 31, 'البيض': 32, 'إليزي': 33, 'برج بوعريريج': 34, 'بومرداس': 35,
  'الطارف': 36, 'تندوف': 37, 'تيسمسيلت': 38, 'الوادي': 39, 'خنشلة': 40,
  'سوق أهراس': 41, 'تيبازة': 42, 'ميلة': 43, 'عين الدفلى': 44, 'النعامة': 45,
  'عين تموشنت': 46, 'غرداية': 47, 'غليزان': 48,
}

export async function generateMbId(wilaya: string): Promise<string> {
  const now = new Date()
  const yearStr = String(now.getFullYear()).slice(-2) // "26"
  const wilayaNum = WILAYA_NUMBERS[wilaya] || 99
  const wilayaStr = String(wilayaNum).padStart(2, '0')
  const prefix = `MB-${yearStr}${wilayaStr}`

  const existing = await User.find({ mbId: { $regex: `^${prefix}` } }).select('mbId')
  let maxNum = 0
  for (const u of existing) {
    if (u.mbId) {
      const numPart = parseInt(u.mbId.replace(prefix, ''), 10)
      if (!isNaN(numPart) && numPart > maxNum) maxNum = numPart
    }
  }

  return `${prefix}${maxNum + 1}`
}
