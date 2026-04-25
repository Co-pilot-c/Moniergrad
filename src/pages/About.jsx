import Button from "../components/atoms/Button.jsx";
import Tittle from "../components/atoms/Tittle.jsx";
import bg from "../assets/images/home.jpeg";
import Description from "../components/atoms/Description.jsx";
import Score from "../components/atoms/Score.jsx";

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="px-4 sm:px-10 py-10 flex flex-col md:flex-row items-center gap-10">
        {/* IMAGE */}
        <div className="w-full md:w-1/2">
          <img src={bg} alt="Background" className="rounded-xl w-full" />
        </div>

        {/* TEXT */}
        <div className="w-full md:w-1/2">
        <div className="px-5">
           <Tittle>About <span className="text-gray-900">Us</span></Tittle>

          <Description style="justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            dolor alias necessitatibus rerum neque! Eligendi libero deserunt
            quidem tempora temporibus eum dolorum consequuntur! Nemo delectus
            aspernatur harum tenetur quos! Nihil corporis sint explicabo ullam
            similique esse sapiente suscipit ipsum doloremque, consequatur
            obcaecati, iusto magnam excepturi. Optio quidem fugit perspiciatis
            tempora nisi officiis, necessitatibus, aperiam, dolores vero harum
            consequatur. Eos nihil veniam sunt molestiae, quos enim inventore?
            Labore, quas magnam quia ex nesciunt nam dolor debitis
            exercitationem omnis minus distinctio modi explicabo ducimus animi
            quo nemo, neque error quibusdam voluptate, quis dolorem aspernatur?
            Dicta soluta ad aperiam explicabo veritatis maxime sint!
          </Description>
        </div>
         

          {/* STATS */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <div className="px-3 border-r border-gray-200">
              <Score value={120} suffix="+" label="Active" />
            </div>

            <div className="px-3 border-r border-gray-200">
              <Score value={92} suffix="K" label="Users" />
            </div>

            <div className="px-3 border-r border-gray-200">
              <Score value={25} suffix="%" label="Growth" />
            </div>

            <div className="px-3">
              <Score value={12} suffix="K+" label="Testimonials" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
