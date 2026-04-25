export default function CardCom({ profile, name, purna, quetes }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 w-full h-full flex flex-col">
      <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col">
        <div className="flex gap-4 sm:gap-5 mb-5 sm:mb-6">
          <img src={profile} alt={name} className="rounded-full w-16 sm:w-20 md:w-24 border-4 border-sky-200" />
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{name}</h1>
            <h3 className="italic text-base sm:text-lg md:text-xl text-gray-600 mt-1">{purna}</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <p className="text-base sm:text-lg md:text-xl text-gray-800 italic leading-relaxed">"{quetes}"</p>
        </div>
      </div>
    </div>
  );
}
