export default function Description({ children, style = "center" }) {
  const styles = {
    center: "text-center",
    justify: "text-justify",
  };

  return (
    <p
      className={`font-poppins text-sm md:text-base lg:text-md mx-auto mt-3 text-gray-900 ${styles[style]}`}
    >
      {children}
    </p>
  );
}
