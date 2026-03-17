import { useState } from 'react';
import styles from './Calendar.module.scss';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar({ selectedDate, onDateSelect, entriesByDate }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const toKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__header}>
        <button className={styles['calendar__nav-btn']} onClick={prevMonth}>‹</button>
        <h2>{MONTHS[month]} {year}</h2>
        <button className={styles['calendar__nav-btn']} onClick={nextMonth}>›</button>
      </div>

      <div className={styles.calendar__weekdays}>
        {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
      </div>

      <div className={styles.calendar__days}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className={`${styles.calendar__day} ${styles['calendar__day--empty']}`} />;

          const dateKey = toKey(year, month, day);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const hasEntries = entriesByDate && entriesByDate[dateKey]?.length > 0;

          let className = styles.calendar__day;
          if (isToday) className += ` ${styles['calendar__day--today']}`;
          if (isSelected) className += ` ${styles['calendar__day--selected']}`;
          if (hasEntries) className += ` ${styles['calendar__day--has-entries']}`;

          return (
            <div
              key={dateKey}
              className={className}
              onClick={() => onDateSelect(dateKey)}
              title={dateKey}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
