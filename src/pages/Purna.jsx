import Title from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import CardCom from "../components/molecules/CardCom";
import My from "../assets/vector/orangk.jpg";

export default function Purna() {
  return (
    <section
      id="purna"
      className="h-screen flex items-center justify-center bg-gray-100"
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-5 overflow-x-auto tailwind-scrollbar-hide mt-10">
          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>

          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>
          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>
          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>
          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>
          <div className="min-w-[400px]">
            <CardCom
              profile={My}
              name="Alfath"
              purna="Angkatan 51"
              quetes="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                    quisquam similique voluptates explicabo mollitia numquam! Labore iusto
                    officia aliquam cum, aliquid eaque provident soluta illum dignissimos!
                    Pariatur quos sit odio."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
