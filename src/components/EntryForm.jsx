import { useState, useEffect } from 'react';
import styles from './EntryForm.module.scss';

const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Work', 'Personal', 'Health', 'Finance', 'Social', 'Other'];

const emptyForm = { title: '', description: '', time: '', priority: 'Medium', category: 'Personal' };

export default function EntryForm({ selectedDate, onAddEntry }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        setForm(emptyForm);
    }, [selectedDate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !selectedDate) return;

        onAddEntry({
            id: Date.now(),
            date: selectedDate,
            title: form.title.trim(),
            description: form.description.trim(),
            time: form.time,
            priority: form.priority,
            category: form.category,
            done: false,
        });

        setForm(emptyForm);
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    if (!selectedDate) {
        return (
            <div className={styles.form}>
                <div className={styles.form__no_date}>
                    <div className={styles.icon}>📅</div>
                    <p>Select a date on the calendar to add an entry</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.form}>
            <h3>
                New Entry
                <span className={styles['date-badge']}>{formatDateDisplay(selectedDate)}</span>
            </h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.form__fields}>
                    <label className={styles.form__label}>
                        Title *
                        <input
                            className={styles.form__input}
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="What's the event?"
                            maxLength={80}
                            autoFocus
                        />
                    </label>

                    <label className={styles.form__label}>
                        Description
                        <textarea
                            className={styles.form__textarea}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Add some notes (optional)..."
                        />
                    </label>

                    <div className={styles.form__row}>
                        <label className={styles.form__label}>
                            Time
                            <input
                                className={styles.form__input}
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                            />
                        </label>

                        <label className={styles.form__label}>
                            Priority
                            <select
                                className={styles.form__select}
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </label>
                    </div>

                    <label className={styles.form__label}>
                        Category
                        <select
                            className={styles.form__select}
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                </div>

                <div className={styles.form__actions}>
                    <button
                        type="button"
                        className={styles.form__btn_clear}
                        onClick={() => setForm(emptyForm)}
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        className={styles.form__btn_submit}
                        disabled={!form.title.trim()}
                    >
                        Add Entry ✦
                    </button>
                </div>
            </form>
        </div>
    );
}
