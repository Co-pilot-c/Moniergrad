export default function Description({ children, style = "center" }) {
  const styles = {
    center: "text-center",
    justify: "text-justify",
  };

  return (
    <p
      className={`text-base md:text-lg lg:text-xl mb-6 text-gray-900 ${styles[style]}`}
    >
      {children}
    </p>
  );
}
