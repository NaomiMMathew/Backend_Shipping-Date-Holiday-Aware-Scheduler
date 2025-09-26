import { calculateShippingDate } from '../scheduler.js';

describe('Shipping Date Scheduler', () => {
  const holidays = ['2025-12-25', '2025-12-26'];

  test('before noon same day', () => {
    const dt = '2025-05-15T10:00:00Z';
    expect(calculateShippingDate(dt, holidays)).toBe('2025-05-15');
  });

  test('after noon next business day', () => {
    const dt = '2025-05-15T13:00:00Z';
    expect(calculateShippingDate(dt, holidays)).toBe('2025-05-16');
  });

  test('weekend rolls to Monday', () => {
    const dt = '2025-05-16T13:00:00Z'; // Friday after noon
    expect(calculateShippingDate(dt, holidays)).toBe('2025-05-19');
  });

  test('holiday rolls over', () => {
    const dt = '2025-12-24T13:00:00Z';
    expect(calculateShippingDate(dt, holidays)).toBe('2025-12-29'); // 25 & 26 holidays + weekend
  });

  test('last Friday after noon -> Monday', () => {
    const dt = '2025-01-31T13:30:00Z'; // last Friday Jan 2025
    expect(calculateShippingDate(dt, [])).toBe('2025-02-03');
  });

  test('exactly 12:00 ships same day', () => {
    const dt = '2025-07-10T12:00:00Z';
    expect(calculateShippingDate(dt, [])).toBe('2025-07-10');
  });
});
