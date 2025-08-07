'use client';

import { useState, useEffect } from 'react';

const startDate = new Date('2025-08-07');
const dates = Array.from({ length: 40 }, (_, i) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  return date.toISOString().slice(0, 10);
});

const columns = [
  'No ₹ Spent',
  'Only Mess Food',
  '15k+ Steps',
  'Weighed In',
  'Exercise',
  'Tracked Food',
];

const LOCAL_STORAGE_KEY = 'trackerData';

export default function TrackerPage() {
  const [data, setData] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // Initialize fresh data if not present
      const initialData = Object.fromEntries(
        dates.map((d) => [
          d,
          Object.fromEntries(columns.map((c) => [c, false]))
        ])
      );
      setData(initialData);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const toggleCell = (date, col) => {
    setData((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [col]: !prev[date][col]
      }
    }));
  };

  if (!Object.keys(data).length) return <p className="p-4">Loading tracker...</p>;

  return (
    <main className="p-6">
      <div className="overflow-auto">
        <table className="table-auto border border-gray-300 w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Date</th>
              {columns.map((col) => (
                <th key={col} className="border px-2 py-1">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => (
              <tr key={date} className="hover:bg-gray-50">
                <td className="border px-2 py-1 font-mono">{date}</td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className={`border px-2 py-1 text-center cursor-pointer ${
                      data[date]?.[col] ? 'bg-green-400' : ''
                    }`}
                    onClick={() => toggleCell(date, col)}
                  >
                    {data[date]?.[col] ? '✅' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
