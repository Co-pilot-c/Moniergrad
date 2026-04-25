export default function CardPro({ image, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white rounded-3xl shadow-md overflow-hidden 
        hover:shadow-xl transition duration-300 
        w-full cursor-pointer group
      "
    >
      {/* Image */}
      <div className="p-4">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-2xl"
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-5 text-gray-900">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h3>
        <p className="text-md md:text-lg mt-2">{description}</p>
      </div>
    </div>
  );
}
