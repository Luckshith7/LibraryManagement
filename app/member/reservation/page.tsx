"use client";

import React, { useState } from "react";
import { useStore } from "@/app/store/useStore";

const DATES = [
  { label: 'Mon', date: 'Oct 13' },
  { label: 'Tue', date: 'Oct 14' },
  { label: 'Wed', date: 'Oct 15' },
  { label: 'Thu', date: 'Oct 16' },
  { label: 'Fri', date: 'Oct 17' },
];
const TIMES = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

export default function ReservationPage() {
  const addReservation = useStore(s => s.addReservation);
  const currentUser = useStore(s => s.currentUser);
  const reservations = useStore(s => s.reservations).filter(r => r.userId === currentUser?.id);
  const cancelReservation = useStore(s => s.cancelReservation);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [materials, setMaterials] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    addReservation({ date: selectedDate, time: selectedTime, materials });
    setSelectedDate(null);
    setSelectedTime(null);
    setMaterials("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-display-sm font-newsreader text-primary mb-2">Reading Room Reservations</h1>
        <p className="text-body-md font-manrope text-on-surface-variant">
          Secure a private desk in the archive&apos;s quiet reading room.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-3xl p-8 space-y-8">
        {/* Date Select */}
        <section>
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Select Date</h2>
          <div className="flex gap-3 flex-wrap">
            {DATES.map(({ label, date }) => (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center w-20 py-4 rounded-2xl transition-all font-manrope ${
                  selectedDate === date
                    ? 'bg-primary text-on-primary shadow-md scale-105'
                    : 'bg-surface hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className={`text-label-xs uppercase tracking-widest mb-2 ${selectedDate === date ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>{label}</span>
                <span className="text-title-md font-bold">{date.split(' ')[1]}</span>
                <span className={`text-label-xs mt-1 ${selectedDate === date ? 'text-on-primary/60' : 'text-on-surface-variant/60'}`}>Oct</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Select */}
        <section className="pt-6 border-t border-outline-variant/20">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Select Time</h2>
          <div className="flex gap-3 flex-wrap">
            {TIMES.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`px-6 py-3 rounded-full text-label-md font-manrope font-bold transition-all ${
                  selectedTime === time
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section className="pt-6 border-t border-outline-variant/20">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-2">Material Declaration</h2>
          <p className="text-body-sm font-manrope text-on-surface-variant mb-4">List any restricted call numbers you intend to study.</p>
          <textarea
            value={materials}
            onChange={e => setMaterials(e.target.value)}
            rows={3}
            placeholder="e.g. NA2760 .R6713, ND1488 .A4..."
            className="w-full bg-surface rounded-xl px-5 py-4 outline-none font-manrope text-body-md text-on-surface focus:shadow-[0_0_0_2px_#012d1d] transition-shadow resize-none placeholder:text-on-surface-variant/40"
          />
        </section>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className="px-8 py-4 bg-primary text-on-primary font-manrope font-bold rounded-xl hover:bg-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitted ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Confirmed!
              </>
            ) : 'Confirm Reservation'}
          </button>
        </div>
      </form>

      {/* Existing Reservations */}
      {reservations.length > 0 && (
        <section>
          <h2 className="text-headline-xs font-newsreader text-primary mb-5">Your Upcoming Reservations</h2>
          <div className="space-y-3">
            {reservations.map(res => (
              <div key={res.id} className="bg-surface-container-low rounded-xl p-5 flex justify-between items-center">
                <div>
                  <p className="font-manrope font-bold text-on-surface">{res.date} at {res.time}</p>
                  {res.materials && <p className="text-body-sm font-manrope text-on-surface-variant mt-1">Materials: {res.materials}</p>}
                </div>
                <button
                  onClick={() => cancelReservation(res.id)}
                  className="text-label-sm font-manrope font-bold text-error hover:bg-error-container/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
