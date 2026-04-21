export default function CardCom({ profile, name, purna, quetes }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 w-100">
      <div className="p-10">
        <div className="flex gap-5 mb-5">
          <img src={profile} alt={name} className="rounded-full w-20" />
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <h3 className="italic text-lg text-gray-500">{purna}</h3>
          </div>
        </div>
        <p className="text-lg text-gray-900">"{quetes}"</p>
      </div>
    </div>
  );
}
