export default function Tittle({ children, size = "large" }) {
  const sizes = {
    small: "text-2xl md:text-3xl lg:text-4xl",
    medium: "text-3xl md:text-4xl lg:text-5xl",
    large: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
    xlarge: "text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
  };

  return (
    <h1 className={`font-poppins font-bold ${sizes[size]} text-gray-900 leading-tight animate-fadeSlideUp`}>
      {children}
    </h1>
  );
}
