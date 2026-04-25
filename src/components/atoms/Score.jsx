import { useEffect, useState } from "react";

export default function Score({ value, suffix, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <h2 className="text-4xl md:text-3xl lg:text-5xl font-bold text-gray-800">
        {count.toLocaleString()}
        {suffix}
      </h2>
      <p className="text-base md:text-md lg:text-lg text-gray-500">{label}</p>
    </div>
  );
}