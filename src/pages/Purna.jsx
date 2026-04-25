import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import CardCom from "../components/molecules/CardCom";
import My from "../assets/vector/orangk.jpg";

export default function Purna() {
  const testimonials = [
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
    { profile: My, name: "Alfath", purna: "Angkatan 51", quetes: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam similique voluptates explicabo mollitia numquam! Labore iusto officia aliquam cum, aliquid eaque provident soluta illum dignissimos! Pariatur quos sit odio." },
  ];

  return (
    <section
      id="purna"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-white py-16"
    >
      <div className="max-w-9xl mx-auto px-4 w-full">
        <div className="mb-8 text-center">
          <Title>Testimoni Alumni</Title>
          <Description>Cerita dari para alumni yang telah berhasil</Description>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative overflow-hidden pb-20">
          <div className="flex space-x-6 animate-scroll">
            {testimonials.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-full max-w-lg">
                <CardCom
                  profile={item.profile}
                  name={item.name}
                  purna={item.purna}
                  quetes={item.quetes}
                />
              </div>
            ))}
            {/* Duplicate cards for seamless loop */}
            {testimonials.map((item, index) => (
              <div key={`dup-${index}`} className="flex-shrink-0 w-full max-w-lg">
                <CardCom
                  profile={item.profile}
                  name={item.name}
                  purna={item.purna}
                  quetes={item.quetes}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
