// US Holidays for 2025-2026 Training Period
export const US_HOLIDAYS = {
  // 2025
  '2025-12-24': 'Christmas Eve',
  '2025-12-25': 'Christmas Day',
  '2025-12-31': "New Year's Eve",

  // 2026
  '2026-01-01': "New Year's Day",
  '2026-01-19': 'MLK Day',
  '2026-02-14': "Valentine's Day",
  '2026-02-16': "Presidents' Day",
  '2026-03-17': "St. Patrick's Day",
  '2026-04-05': 'Easter Sunday',
  '2026-04-12': 'Easter Monday',
  '2026-05-10': "Mother's Day",
  '2026-05-25': 'Memorial Day',
  '2026-06-14': 'Flag Day / RACE DAY!',
  '2026-06-21': "Father's Day",
  '2026-07-04': 'Independence Day',
  '2026-09-07': 'Labor Day',
  '2026-10-12': 'Columbus Day',
  '2026-10-31': 'Halloween',
  '2026-11-11': 'Veterans Day',
  '2026-11-26': 'Thanksgiving',
  '2026-11-27': 'Day After Thanksgiving',
  '2026-12-24': 'Christmas Eve',
  '2026-12-25': 'Christmas Day',
  '2026-12-31': "New Year's Eve",
};

export function getHolidayForDate(dateStr) {
  return US_HOLIDAYS[dateStr] || null;
}
