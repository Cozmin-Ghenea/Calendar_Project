import { useState, useMemo } from 'react';
import Calendar from './components/Calendar';
import DoctorPanel from './components/DoctorPanel';
import BookingList from './components/BookingList';
import Login from './components/Login';
import './App.scss';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Build a set of dates that have at least one booking (for calendar dots)
  const bookedDates = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    });
    return map;
  }, [bookings]);

  const handleBook = (booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const handleCancel = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">🐾</span>
            <span>PawsCalendar</span>
          </div>
          <div className="app__stats">
            <span className="app__stat">
              <span className="app__stat-n">{bookings.length}</span>
              <span className="app__stat-l">programări active</span>
            </span>
            {selectedDate && (
              <span className="app__stat app__stat--accent">
                <span className="app__stat-n">📍</span>
                <span className="app__stat-l">{selectedDate}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="app__main">
        {/* Left: Calendar + Doctor Panel */}
        <div className="app__left">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={(date) => setSelectedDate(date === selectedDate ? null : date)}
            entriesByDate={bookedDates}
          />
          <DoctorPanel
            selectedDate={selectedDate}
            bookings={bookings}
            onBook={handleBook}
          />
        </div>

        {/* Right: Bookings List */}
        <div className="app__right">
          <BookingList
            bookings={bookings}
            onCancel={handleCancel}
          />
        </div>
      </main>

      <div className="app__glow" />
    </div>
  );
}
