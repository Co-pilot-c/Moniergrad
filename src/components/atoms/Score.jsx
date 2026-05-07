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

  // Tampilan value + suffix untuk hitung panjang
  const displayFull = (isNumeric ? String(Math.floor(parsed)) : strVal) + (suffix || '');
  const len = displayFull.length;

  // Font size berdasarkan panjang — tidak ada truncate/clip
  const valueSize =
    len <= 3  ? "text-4xl lg:text-4xl" :
    len <= 5  ? "text-3xl lg:text-3xl" :
    len <= 8  ? "text-2xl lg:text-2xl" :
    len <= 12 ? "text-xl  lg:text-xl"  :
                "text-lg  lg:text-lg";

  return (
    <div className="text-center">
      {/* whitespace-nowrap mencegah teks wrap di tengah kata */}
      <h2 className={`font-bold bg-gradient-green bg-clip-text text-transparent whitespace-nowrap ${valueSize}`}>
        {isNumeric ? count.toLocaleString() : strVal}
        <span className="text-primary-600">{suffix}</span>
      </h2>
      <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 whitespace-nowrap">{label}</p>
    </div>
  );
}
