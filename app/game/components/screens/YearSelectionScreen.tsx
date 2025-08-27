'use client';

import { useGame } from '../../context/GameContext';

const yearOptions = [
  { value: '1950s', label: '1950 年代', color: 'bg-orange-500' },
  { value: '1960s', label: '1960 年代', color: 'bg-blue-600' },
  { value: '1970s', label: '1970 年代', color: 'bg-purple-500' },
  { value: '1980s', label: '1980 年代', color: 'bg-pink-500' },
];

export default function YearSelectionScreen() {
  const { selectYear } = useGame();

  const handleYearSelect = (year: string) => {
    selectYear(year);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-gray-700 mb-12">
          如果可以，我想回到......的台灣
        </h1>

        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          {yearOptions.map((year) => (
            <button
              key={year.value}
              onClick={() => handleYearSelect(year.value)}
              className={`${year.color} text-white font-bold text-2xl py-16 px-8 rounded-2xl hover:opacity-90 transition-opacity`}
            >
              {year.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-white border border-gray-300 text-gray-600 px-6 py-2 rounded-xl text-lg">
            🎲 換一組（剩3次）
          </button>
        </div>
      </div>
    </div>
  );
}