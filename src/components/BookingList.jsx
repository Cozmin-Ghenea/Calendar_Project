import { useState } from 'react';
import styles from './BookingList.module.scss';

const FILTERS = ['Toate', 'Azi', 'Această Săptămână'];

function toDateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekKeys(d) {
    const keys = new Set();
    for (let i = 0; i < 7; i++) {
        const day = new Date(d);
        day.setDate(d.getDate() + i);
        keys.add(toDateKey(day));
    }
    return keys;
}

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

export default function BookingList({ bookings, onCancel }) {
    const [filter, setFilter] = useState('Toate');
    const [removingIds, setRemovingIds] = useState(new Set());

    const today = new Date();
    const todayKey = toDateKey(today);
    const weekKeys = getWeekKeys(today);

    const filtered = bookings.filter(b => {
        if (filter === 'Azi') return b.date === todayKey;
        if (filter === 'Această Săptămână') return weekKeys.has(b.date);
        return true;
    });

    // Sort by date then hour
    const sorted = [...filtered].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.hour - b.hour;
    });

    const handleCancel = (id) => {
        setRemovingIds(prev => new Set([...prev, id]));
        setTimeout(() => {
            onCancel(id);
            setRemovingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 350);
    };

    return (
        <div className={styles.bookings}>
            <div className={styles.bookings__header}>
                <h3>Programările Mele</h3>
                <span className={styles.count}>{bookings.length}</span>
            </div>

            <div className={styles.bookings__filters}>
                {FILTERS.map(f => (
                    <button
                        key={f}
                        className={`${styles['bookings__filter-btn']} ${filter === f ? styles['bookings__filter-btn--active'] : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className={styles.bookings__scroll}>
                {sorted.length === 0 ? (
                    <div className={styles.bookings__empty}>
                        <div className={styles.icon}>📋</div>
                        <p>Nicio programare încă.<br />Alege o dată și un doctor din calendar!</p>
                    </div>
                ) : (
                    sorted.map(booking => (
                        <div
                            key={booking.id}
                            className={`${styles.card} ${removingIds.has(booking.id) ? styles['card--removing'] : ''}`}
                        >
                            {/* Doctor avatar */}
                            <div
                                className={styles.card__avatar}
                                style={{ background: booking.doctorColor }}
                            >
                                {booking.doctorAvatar}
                            </div>

                            {/* Info */}
                            <div className={styles.card__body}>
                                <div className={styles.card__name}>{booking.doctorName}</div>
                                <div className={styles.card__specialty}>{booking.specialty}</div>
                                <div className={styles.card__meta}>
                                    <span>📅 {formatDate(booking.date)}</span>
                                    <span className={styles.card__time_badge}>
                                        🕐 {booking.slot}
                                    </span>
                                </div>
                            </div>

                            {/* Cancel */}
                            <button
                                className={styles.card__cancel}
                                onClick={() => handleCancel(booking.id)}
                                title="Anulează programarea"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
