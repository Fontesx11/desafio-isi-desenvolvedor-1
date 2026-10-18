import { calculateRemainingDays, formatBrasiliaDateTime, isBrasiliaDateTime } from './date.utils.js';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

describe('isBrasiliaDateTime', () => {
  it.each(['2027-03-02T10:15-03:00', '2027-03-02T23:59-03:00', '2028-02-29T10:15-03:00', '2000-02-29T10:15-03:00'])('accepts %s', (value) => {
    expect(isBrasiliaDateTime(value)).toBe(true);
  });

  it.each([
    '2027-03-02T10:15:00-03:00',
    '2027-03-02T10:15:00.000-03:00',
    '2027-03-02T13:15Z',
    '2027-03-02T10:15+00:00',
    '2027-03-02T10:15-0300',
    '2027-03-02T10:15',
    '2027-03-02 10:15-03:00',
    '2027-3-2T10:15-03:00',
    '2027-03-02T9:15-03:00',
    '2027-02-30T10:15-03:00',
    '2027-02-29T10:15-03:00',
    '2100-02-29T10:15-03:00',
    '2027-04-31T10:15-03:00',
    '2027-13-01T10:15-03:00',
    '2027-03-02T24:00-03:00',
    '2027-03-02T10:60-03:00',
    ' 2027-03-02T10:15-03:00',
    '2027-03-02T10:15-03:00 ',
    '',
  ])('rejects %j', (value) => {
    expect(isBrasiliaDateTime(value)).toBe(false);
  });
});

describe('formatBrasiliaDateTime', () => {
  it.each([
    ['2027-03-02T13:15:00.000Z', '2027-03-02T10:15:00-03:00'],
    ['2026-11-05T19:40:00.000Z', '2026-11-05T16:40:00-03:00'],
    ['2026-11-03T01:30:00.000Z', '2026-11-02T22:30:00-03:00'],
    ['2027-01-01T02:59:59.999Z', '2026-12-31T23:59:59-03:00'],
  ])('%s -> %s', (value, expected) => {
    expect(formatBrasiliaDateTime(new Date(value))).toBe(expected);
  });

  it('round-trips a date sent in the RN01 format', () => {
    expect(formatBrasiliaDateTime(new Date('2027-03-02T10:15-03:00'))).toBe('2027-03-02T10:15:00-03:00');
  });
});

describe('calculateRemainingDays', () => {
  const now = new Date('2026-11-02T13:15:00.000Z');

  it.each([
    ['already passed', -DAY_MS, 0],
    ['exactly now', 0, 0],
    ['10 days and 2 hours', 10 * DAY_MS + 2 * HOUR_MS, 11],
    ['exactly 30 days', 30 * DAY_MS, 30],
    ['30 days and 1 minute', 30 * DAY_MS + MINUTE_MS, 31],
    ['exactly 180 days', 180 * DAY_MS, 180],
    ['180 days and 1 minute', 180 * DAY_MS + MINUTE_MS, 181],
    ['200 days', 200 * DAY_MS, 200],
    ['116 days, 17 hours and 35 minutes', 116 * DAY_MS + 17 * HOUR_MS + 35 * MINUTE_MS, 117],
  ])('%s -> %i', (_label, offsetMs, expected) => {
    const until = new Date(now.getTime() + offsetMs);

    expect(calculateRemainingDays(until, now)).toBe(expected);
  });
});
