import { useState } from 'react';
import styles from './EntryList.module.scss';

const FILTERS = ['All', 'Today', 'This Week'];

export default function EntryList({ entries, onComplete, onDelete }) {
    const [filter, setFilter] = useState('All');
    const [removingIds, setRemovingIds] = useState(new Set());

    const today = new Date();
    const todayKey = toDateKey(today);
    const weekKeys = getWeekKeys(today);

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

    const filtered = entries.filter(e => {
        if (filter === 'Today') return e.date === todayKey;
        if (filter === 'This Week') return weekKeys.has(e.date);
        return true;
    });

    const handleComplete = (id) => {
        setRemovingIds(prev => new Set([...prev, id]));
        setTimeout(() => {
            onComplete(id);
            setRemovingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 380);
    };

    const handleDelete = (id) => {
        setRemovingIds(prev => new Set([...prev, id]));
        setTimeout(() => {
            onDelete(id);
            setRemovingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 380);
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className={styles.list}>
            <div className={styles.list__header}>
                <h3>Entries</h3>
                <span className={styles.count}>{entries.length}</span>
            </div>

            <div className={styles.list__filters}>
                {FILTERS.map(f => (
                    <button
                        key={f}
                        className={`${styles['list__filter-btn']} ${filter === f ? styles['list__filter-btn--active'] : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className={styles.list__scroll}>
                {filtered.length === 0 ? (
                    <div className={styles.list__empty}>
                        <div className={styles.icon}>🗓️</div>
                        <p>No entries yet.<br />Select a date and add one!</p>
                    </div>
                ) : (
                    filtered.map(entry => (
                        <div
                            key={entry.id}
                            className={`${styles.entry} ${removingIds.has(entry.id) ? styles['entry--removing'] : ''}`}
                        >
                            {/* Completion circle */}
                            <div
                                className={styles.entry__checkbox}
                                onClick={() => handleComplete(entry.id)}
                                title="Mark as done"
                            >
                                ✓
                            </div>

                            <div className={styles.entry__body}>
                                <div className={styles.entry__top}>
                                    <span className={styles.entry__title}>{entry.title}</span>
                                    <div className={styles.entry__badges}>
                                        <span className={`${styles.entry__badge} ${styles[`entry__badge--${entry.priority.toLowerCase()}`]}`}>
                                            {entry.priority}
                                        </span>
                                        <span className={styles.entry__cat}>{entry.category}</span>
                                    </div>
                                </div>

                                <div className={styles.entry__meta}>
                                    <span>📅 {formatDate(entry.date)}</span>
                                    {entry.time && (
                                        <>
                                            <span className={styles.sep}>·</span>
                                            <span>🕐 {entry.time}</span>
                                        </>
                                    )}
                                </div>

                                {entry.description && (
                                    <div className={styles.entry__desc}>{entry.description}</div>
                                )}
                            </div>

                            {/* Delete button */}
                            <button
                                className={styles.entry__delete}
                                onClick={() => handleDelete(entry.id)}
                                title="Delete entry"
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
