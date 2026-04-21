export default function CardPro({ image, tittle, description, onClick }) {
  return (
    <div 
      className="relative rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 w-full h-[400px] cursor-pointer group"
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white">{tittle}</h3>
        <p className="text-gray-200 mt-2">{description}</p>
      </div>

      {onClick && (
        <button 
          onClick={onClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-sky-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-sky-600"
        >
          Selengkapnya
        </button>
      )}
    </div>
  );
}
