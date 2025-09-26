import { DateTime } from 'luxon';

/**
 * Calculate expected shipping date.
 * @param {string|Date} orderDatetime  
 *        
 * @param {string[]} holidays          
 * @returns {string}                   
 */
export function calculateShippingDate(orderDatetime, holidays = []) {
  //Parse the input 
  let dt;
  if (orderDatetime instanceof Date) {
    dt = DateTime.fromJSDate(orderDatetime, { zone: 'utc' });
  } else if (typeof orderDatetime === 'string') {
    
    dt = DateTime.fromISO(orderDatetime, { zone: 'utc' });
    if (!dt.isValid) {
      dt = DateTime.fromFormat(orderDatetime, 'yyyy-MM-dd', { zone: 'utc' });
    }
  } else {
    throw new Error('Invalid orderDatetime format');
  }

  if (!dt.isValid) throw new Error('Could not parse orderDatetime');

  const holidaySet = new Set(holidays);

  //Helpers
  const isHoliday = (d) => holidaySet.has(d.toISODate());
  const isWeekend = (d) => d.weekday === 6 || d.weekday === 7;

  const nextBusinessDay = (d) => {
    let cur = d.startOf('day');
    while (isWeekend(cur) || isHoliday(cur)) {
      cur = cur.plus({ days: 1 });
    }
    return cur;
  };

  // Last Friday after noon 
  const endOfMonth = dt.endOf('month');
  const lastFriday = endOfMonth
    .minus({ days: (endOfMonth.weekday + 2) % 7 + 1 })
    .startOf('day');

  if (dt.hasSame(lastFriday, 'day') && dt.hour >= 12) {
    // Next Monday or next business day
    let ship = lastFriday.plus({ days: 3 }); // Monday
    ship = nextBusinessDay(ship);
    return ship.toISODate();
  }

  //  Normal orders
  let ship;
  if (dt.hour < 12) {
    ship = dt.startOf('day'); // same day
  } else {
    ship = dt.plus({ days: 1 }).startOf('day'); // next day
  }

  ship = nextBusinessDay(ship);
  return ship.toISODate();
}
