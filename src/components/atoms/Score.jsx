import { useEffect, useState } from "react";

export default function Score({ value, suffix, label, isText = false }) {
  const strVal = String(value ?? '');
  const parsed = parseFloat(strVal);
  const isNumeric = !isText && strVal !== '' && !isNaN(parsed) && isFinite(parsed);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const duration = 2000;
    const increment = parsed / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= parsed) { setCount(parsed); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [parsed, isNumeric]);

  // Tentukan ukuran font berdasarkan panjang teks yang akan ditampilkan
  const displayText = isNumeric ? String(Math.floor(parsed)) + (suffix || '') : strVal + (suffix || '');
  const len = displayText.length;
  const valueSize = len <= 4
    ? "text-4xl md:text-3xl lg:text-4xl"
    : len <= 7
    ? "text-2xl md:text-2xl lg:text-3xl"
    : len <= 10
    ? "text-xl md:text-xl lg:text-2xl"
    : "text-lg md:text-lg lg:text-xl";

  return (
    <div className="text-center group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-400" />
        <h2 className={`relative font-bold bg-gradient-green bg-clip-text text-transparent leading-tight ${valueSize}`}>
          {isNumeric ? count.toLocaleString() : strVal}
          <span className="text-primary-600">{suffix}</span>
        </h2>
      </div>
      <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 leading-tight">{label}</p>
    </div>
  );
}
