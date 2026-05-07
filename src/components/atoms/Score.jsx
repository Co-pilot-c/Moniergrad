import { useEffect, useState } from "react";

export default function Score({ value, suffix, label, isText = false }) {
  // Auto-detect: jika value bukan angka murni, perlakukan sebagai teks
  const strVal = String(value ?? '');
  const parsed = parseFloat(strVal);
  const isNumeric = !isText && strVal !== '' && !isNaN(parsed) && isFinite(parsed);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isNumeric) return; // string → tidak perlu counter

    let start = 0;
    const duration = 2000;
    const increment = parsed / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= parsed) {
        setCount(parsed);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [parsed, isNumeric]);

  return (
    <div className="text-center group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-400" />
        <h2 className="relative text-5xl md:text-3xl lg:text-4xl font-bold bg-gradient-green bg-clip-text text-transparent">
          {isNumeric ? count.toLocaleString() : strVal}
          <span className="text-primary-600">{suffix}</span>
        </h2>
      </div>
      <p className="text-sm md:text-base text-gray-600 font-medium mt-1">{label}</p>
    </div>
  );
}
