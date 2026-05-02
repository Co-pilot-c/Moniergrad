export default function Subtitle({ children }) {
  return (
    <h2 className="font-poppins font-medium text-lg md:text-xl lg:text-2xl text-gray-600 animate-fadeSlideUp" style={{animationDelay: "0.1s"}}>
      {children}
    </h2>
  );
}
