export default function CardProfile({ image, name, role }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden 
                    hover:shadow-xl transition duration-300 w-64">
      
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-60 object-cover"
      />

      {/* Content */}
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {name}
        </h2>
        <p className="text-sm text-gray-500">
          {role}
        </p>
      </div>
    </div>
  );
}