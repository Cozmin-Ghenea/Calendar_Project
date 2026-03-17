export const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Andrei Popescu',
    specialty: 'Cardiologie Veterinară',
    avatar: 'AP',
    color: '#8b83ff', // Soft purple
    rating: 4.9,
    experience: '12 ani',
  },
  {
    id: 2,
    name: 'Dr. Maria Ionescu',
    specialty: 'Chirurgie',
    avatar: 'MI',
    color: '#ec4899', // Pink
    rating: 4.7,
    experience: '8 ani',
  },
  {
    id: 3,
    name: 'Dr. Radu Dumitrescu',
    specialty: 'Ortopedie Veterinară',
    avatar: 'RD',
    color: '#14b8a6', // Teal
    rating: 4.8,
    experience: '15 ani',
  },
  {
    id: 4,
    name: 'Dr. Elena Constantin',
    specialty: 'Dermatologie',
    avatar: 'EC',
    color: '#f59e0b', // Amber/Orange
    rating: 4.6,
    experience: '6 ani',
  },
  {
    id: 5,
    name: 'Dr. Mihai Gheorghe',
    specialty: 'Medicină Generală',
    avatar: 'MG',
    color: '#34d399', // Soft Green
    rating: 4.9,
    experience: '20 ani',
  },
];

// Working hours: 08:00 - 18:00, slots of 1 hour
export const WORK_HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // [8, 9, ..., 17]

/**
 * Generate busy slots for a doctor on a specific date.
 * Uses a deterministic pseudo-random function based on doctorId + dateString
 * so the same date always shows the same busy slots.
 */
function seededRand(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function getBusySlotsForDoctor(doctorId, dateStr) {
  // Create a numeric seed from doctorId + date characters
  const base = dateStr.split('-').reduce((acc, part, i) => acc + parseInt(part) * (i + 1), 0);
  const seed = base * doctorId;

  const busySlots = new Set();
  WORK_HOURS.forEach((hour, idx) => {
    const rand = seededRand(seed + idx * 13);
    // ~30% chance any slot is busy
    if (rand < 0.30) {
      busySlots.add(hour);
    }
  });

  return busySlots; // Set of busy hours (e.g. new Set([10, 14, 15]))
}

export function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function formatSlot(hour) {
  return `${formatHour(hour)} – ${formatHour(hour + 1)}`;
}
