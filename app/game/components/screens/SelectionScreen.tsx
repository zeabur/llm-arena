'use client';

interface SelectionOption {
  id: string;
  name: string;
  color: string;
}

interface SelectionScreenProps {
  title: string;
  options: SelectionOption[];
  onSelect: (optionId: string) => void;
}

export default function SelectionScreen({ title, options, onSelect }: SelectionScreenProps) {
  const handleSelect = (optionId: string) => {
    onSelect(optionId);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-gray-700 mb-12">
          {title}
        </h1>

        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`${option.color} text-white font-bold text-2xl py-16 px-8 rounded-2xl hover:opacity-90 transition-opacity`}
            >
              {option.name}
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