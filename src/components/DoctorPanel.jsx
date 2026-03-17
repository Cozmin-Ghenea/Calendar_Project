import { useState } from 'react';
import { DOCTORS, WORK_HOURS, getBusySlotsForDoctor, formatHour, formatSlot } from '../data/doctors';
import styles from './DoctorPanel.module.scss';

function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('ro-RO', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

function DoctorCard({ doctor, selectedDate, bookings, onBook }) {
    const [expanded, setExpanded] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const busySlots = getBusySlotsForDoctor(doctor.id, selectedDate);

    // Find slots already booked by user for this doctor + date
    const bookedSlots = new Set(
        bookings
            .filter(b => b.doctorId === doctor.id && b.date === selectedDate)
            .map(b => b.hour)
    );

    const handleSlotClick = (hour) => {
        if (busySlots.has(hour) || bookedSlots.has(hour)) return;
        setSelectedSlot(prev => (prev === hour ? null : hour));
    };

    const handleBook = () => {
        if (selectedSlot === null) return;
        onBook({
            id: Date.now(),
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            doctorColor: doctor.color,
            doctorAvatar: doctor.avatar,
            date: selectedDate,
            hour: selectedSlot,
            slot: formatSlot(selectedSlot),
        });
        setSelectedSlot(null);
        setExpanded(false);
    };

    const freeCount = WORK_HOURS.filter(h => !busySlots.has(h) && !bookedSlots.has(h)).length;

    return (
        <div className={`${styles.doctor} ${expanded ? styles['doctor--expanded'] : ''}`}>
            <div className={styles.doctor__header} onClick={() => { setExpanded(e => !e); setSelectedSlot(null); }}>
                {/* Avatar */}
                <div className={styles.doctor__avatar} style={{ background: doctor.color }}>
                    {doctor.avatar}
                </div>

                {/* Info */}
                <div className={styles.doctor__info}>
                    <div className={styles.doctor__name}>{doctor.name}</div>
                    <div className={styles.doctor__specialty}>{doctor.specialty}</div>
                </div>

                {/* Meta */}
                <div className={styles.doctor__meta}>
                    <span className={styles.doctor__rating}>★ {doctor.rating}</span>
                    <span className={styles.doctor__exp}>{doctor.experience}</span>
                </div>

                {/* Free slots badge & chevron */}
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: freeCount > 0 ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.1)',
                    color: freeCount > 0 ? '#4ade80' : '#f87171',
                    border: `1px solid ${freeCount > 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.25)'}`,
                    borderRadius: '20px', padding: '2px 8px', marginLeft: '4px', flexShrink: 0
                }}>
                    {freeCount} libere
                </span>

                <span className={`${styles.doctor__chevron} ${expanded ? styles['doctor__chevron--open'] : ''}`}>▼</span>
            </div>

            {/* Expandable slots */}
            {expanded && (
                <div className={styles.doctor__slots}>
                    <span className={styles['doctor__slots-label']}>
                        Alege un interval orar
                    </span>

                    <div className={styles['doctor__slots-grid']}>
                        {WORK_HOURS.map(hour => {
                            const isBusy = busySlots.has(hour);
                            const isBooked = bookedSlots.has(hour);
                            const isSelected = selectedSlot === hour;

                            let slotClass = styles.doctor__slot;
                            if (isBusy) slotClass += ` ${styles['doctor__slot--busy']}`;
                            else if (isBooked) slotClass += ` ${styles['doctor__slot--booked']}`;
                            else if (isSelected) slotClass += ` ${styles['doctor__slot--selected']}`;

                            return (
                                <button
                                    key={hour}
                                    className={slotClass}
                                    onClick={() => handleSlotClick(hour)}
                                    disabled={isBusy || isBooked}
                                    title={isBusy ? 'Ocupat' : isBooked ? 'Rezervat de tine' : `Disponibil: ${formatSlot(hour)}`}
                                >
                                    <span className={styles['doctor__slot-time']}>
                                        {formatHour(hour)}
                                    </span>
                                    <span className={styles['doctor__slot-time']} style={{ opacity: 0.6, fontSize: '0.6rem' }}>
                                        {isBusy ? '✕' : isBooked ? '✓' : '–'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
                        {[
                            { color: '#34d399', label: 'Liber' },
                            { color: '#f87171', label: 'Ocupat' },
                            { color: '#f27c59', label: 'Selectat' },
                            { color: '#34d399', label: 'Rezervat', opacity: 0.5 },
                        ].map(({ color, label, opacity }) => (
                            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.63rem', color: '#9896a8', opacity: opacity || 1 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', opacity: opacity || 1 }} />
                                {label}
                            </span>
                        ))}
                    </div>

                    {selectedSlot !== null && (
                        <div className={styles.doctor__confirm}>
                            <button className={styles['doctor__btn-cancel']} onClick={() => setSelectedSlot(null)}>
                                Anulează
                            </button>
                            <button className={styles['doctor__btn-book']} onClick={handleBook}>
                                Confirmă {formatSlot(selectedSlot)} 🐾
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function DoctorPanel({ selectedDate, bookings, onBook }) {
    if (!selectedDate) {
        return (
            <div className={styles.panel}>
                <div className={styles.panel__no_date}>
                    <div className={styles.icon}>🏥</div>
                    <p>Selectează o dată din calendar<br />pentru a vedea medicii disponibili.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.panel}>
            <div className={styles.panel__header}>
                <h3>Medici Disponibili</h3>
                <div className="date-label" style={{ fontSize: '0.75rem', color: '#f27c59', fontWeight: 600, marginTop: 2 }}>
                    📅 {formatDateDisplay(selectedDate)}
                </div>
            </div>

            <div className={styles.panel__doctors}>
                {DOCTORS.map(doctor => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        selectedDate={selectedDate}
                        bookings={bookings}
                        onBook={onBook}
                    />
                ))}
            </div>
        </div>
    );
}
