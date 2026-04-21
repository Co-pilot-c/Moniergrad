import Card from "../components/molecules/Card";
import Orang from "../assets/orang/orangan.jpeg";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";

export default function Strukture() {
  return (
    <section
      id="strukture"
      className="h-screen flex items-center justify-center bg-gray-100"
    >

      {/* Content */}
      <div className="text-center max-w-7xl mx-auto mb-16 px-4">
        <Tittle>Struktur Organisasi</Tittle>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam
          magnam corrupti dicta praesentium aspernatur eligendi deserunt esse
          officiis itaque nam eaque facere inventore adipisci vitae, velit sit
          tenetur delectus tempore?
        </Description>

        <div className="flex gap-5 overflow-x-auto tailwind-scrollbar-hide mt-10">
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
          <div className="min-w-[250px]">
            <Card image={Orang} name="Alfath" role="Humas" />
          </div>
        </div>
      </div>
    </section>
  );
}
