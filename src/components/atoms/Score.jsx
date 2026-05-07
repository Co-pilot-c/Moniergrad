import { useEffect, useState } from "react";

export default function Score({ value, suffix, label, isText = false }) {
  const strVal = String(value ?? '');

  // Numerik HANYA jika seluruh string adalah angka murni (bukan "12-25 Nov", "Yonif 321", dll)
  // Regex: opsional minus, lalu digit saja (boleh desimal)
  const isNumeric = !isText && /^-?\d+(\.\d+)?$/.test(strVal.trim());
  const parsed = isNumeric ? parseFloat(strVal) : 0;

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

  // Panjang teks yang akan ditampilkan (value + suffix)
  const displayFull = (isNumeric ? String(Math.floor(parsed)) : strVal) + (suffix || '');
  const len = displayFull.length;

  const valueSize =
    len <= 3  ? "text-4xl lg:text-4xl" :
    len <= 5  ? "text-3xl lg:text-3xl" :
    len <= 8  ? "text-2xl lg:text-2xl" :
    len <= 12 ? "text-xl  lg:text-xl"  :
                "text-lg  lg:text-lg";

  return (
    <div className="text-center">
      <h2 className={`font-bold bg-gradient-green bg-clip-text text-transparent whitespace-nowrap ${valueSize}`}>
        {isNumeric ? count.toLocaleString() : strVal}
        <span className="text-primary-600">{suffix}</span>
      </h2>
      <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 whitespace-nowrap">{label}</p>
    </div>
  );
}
