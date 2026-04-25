export default function CardProfile({ image, name, jabatan, periode }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden 
      hover:shadow-xl transition duration-300 w-full sm:w-62"
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-48 sm:h-60 object-cover"
      />

      {/* Content */}
      <div className="p-3 sm:p-4 text-left">
        <p className="text-base italic text-gray-500 ">{periode}</p>
        <h1 className="text-2xl font-bold text-gray-900">
          {name}
        </h1>
        <h3 className="text-1xl font-semibold text-gray-800">{jabatan}</h3>
        
      </div>
    </div>
  );
}
