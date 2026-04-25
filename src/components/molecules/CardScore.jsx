import Score from "../atoms/Score";

export default function CardScore({ value, suffix, label }) {
  return (
    <div className=" backdrop-blur-lg bg-sky-100/50 border border-white shadow-xl rounded-2xl p-5 text-center hover:scale-105 transition duration-300">
      <Score value={value} suffix={suffix} label={label} />
    </div>
  );
}
