import { useEffect, useState } from "react";

export default function Score({ value, suffix, label, isText = false }) {
  const numericValue = isText ? 0 : (typeof value === 'string' ? parseFloat(value) || 0 : value);
  const [count, setCount] = useState(isText ? 0 : 0);

  useEffect(() => {
    // Jika isText = true, tampilkan value as-is tanpa animasi counter
    if (isText) return;

    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue, isText]);

  return (
    <div className="text-center group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-400"></div>
        <h2 className="relative text-5xl md:text-3xl lg:text-4xl xl:5text-xl font-bold bg-gradient-green bg-clip-text text-transparent">
          {isText ? value : count.toLocaleString()}
          <span className="text-primary-600">{suffix}</span>
        </h2>
      </div>
      <p className="text-sm md:text-base text-gray-600 font-medium mt-1">{label}</p>
    </div>
  );
}
