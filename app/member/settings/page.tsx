"use client";

import React, { useState } from "react";
import { useStore } from "@/app/store/useStore";

export default function MemberSettings() {
  const currentUser = useStore(s => s.currentUser);
  const addToast = useStore(s => s.addToast);

  const [notifications, setNotifications] = useState({
    reservationReminders: true,
    dueDateWarnings: true,
    newAcquisitions: false,
    systemUpdates: false,
  });
  const [autoRenew, setAutoRenew] = useState(true);
  const [viewMode, setViewMode] = useState("High Fidelity");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addToast("Settings saved successfully.", "success");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-display-sm font-newsreader text-primary mb-2">Settings</h1>
        <p className="text-body-md font-manrope text-on-surface-variant">
          Manage your archival preferences and notification channels.
        </p>
      </div>

      <div className="space-y-6">
        {/* Preferences */}
        <section className="bg-surface-container-low rounded-2xl p-8 space-y-6">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold">Archive Preferences</h2>

          <div className="flex items-center justify-between py-4 border-b border-outline-variant/20">
            <div>
              <p className="font-manrope text-body-md text-on-surface font-semibold">Default Viewing Mode</p>
              <p className="font-manrope text-body-sm text-on-surface-variant">How digital materials are displayed.</p>
            </div>
            <select
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              className="bg-surface-container rounded-xl px-4 py-2 outline-none font-manrope text-body-sm text-on-surface focus:shadow-[0_0_0_2px_#012d1d] transition-shadow appearance-none"
            >
              <option>High Fidelity</option>
              <option>Text-Only (Accessible)</option>
              <option>Reader Optimized</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-manrope text-body-md text-on-surface font-semibold">Auto-Renew Eligible Materials</p>
              <p className="font-manrope text-body-sm text-on-surface-variant">Extend loan periods automatically if no holds exist.</p>
            </div>
            <button
              onClick={() => setAutoRenew(!autoRenew)}
              className={`relative w-12 h-6 rounded-full transition-colors ${autoRenew ? 'bg-primary' : 'bg-surface-container-high'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoRenew ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-surface-container-low rounded-2xl p-8 space-y-5">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold">Notifications</h2>
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
            const labels: Record<string, string> = {
              reservationReminders: 'Reservation Reminders',
              dueDateWarnings: 'Due Date Warnings',
              newAcquisitions: 'New Acquisitions Weekly',
              systemUpdates: 'System Updates',
            };
            return (
              <label key={key} className="flex items-center justify-between cursor-pointer py-2">
                <span className="font-manrope text-body-md text-on-surface">{labels[key]}</span>
                <button
                  type="button"
                  onClick={() => setNotifications(n => ({...n, [key]: !n[key]}))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${val ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${val ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </label>
            );
          })}
        </section>

        {/* Account */}
        <section className="bg-surface-container-low rounded-2xl p-8">
          <h2 className="text-label-md font-manrope text-on-surface-variant uppercase tracking-widest font-bold mb-5">Account Information</h2>
          <dl className="grid grid-cols-2 gap-5">
            {[
              { label: 'Name', value: currentUser?.name },
              { label: 'Member ID', value: currentUser?.id },
              { label: 'Email', value: currentUser?.email },
              { label: 'Tier', value: currentUser?.tier },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-label-sm font-manrope text-on-surface-variant mb-1">{label}</dt>
                <dd className="text-body-md font-manrope text-on-surface font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`px-8 py-3.5 font-manrope font-bold rounded-xl transition-all flex items-center gap-2 ${
              saved
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            {saved ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
