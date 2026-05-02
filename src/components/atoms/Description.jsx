export default function Description({ children, style = "center", size = "base" }) {
  const styles = {
    center: "text-center",
    justify: "text-justify",
    left: "text-left"
  };

  const sizes = {
    small: "text-sm md:text-base",
    base: "text-base md:text-lg",
    large: "text-lg md:text-xl",
    xlarge: "text-xl md:text-2xl"
  };

  return (
    <p
      className={`font-poppins ${sizes[size]} mx-auto mt-3 text-gray-600 leading-relaxed ${styles[style]} animate-fadeSlideUp`}
      style={{animationDelay: "0.2s"}}
    >
      {children}
    </p>
  );
}
