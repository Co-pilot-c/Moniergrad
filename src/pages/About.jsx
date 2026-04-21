import Button from "../components/atoms/Button.jsx";
import Tittle from "../components/atoms/Tittle.jsx";
import bg from "../assets/images/home.jpeg";
import Description from "../components/atoms/Description.jsx";

export default function About() {
  return (
    <section
      id="about"
      className="h-screen bg-cover bg-center flex items-center justify-center"
    >
      {/* Content */}
      <div className="m-10 flex items-center text-left">

        <div className="w-1/2 mx-auto">
          <img src={bg} alt="Background" className="rounded-xl" />
        </div>

        <div className="w-1/2 mx-auto">
          <Tittle>About Us</Tittle>
          <Description>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. Lorem Ipsum is simply dummy text of the printing
            and typesetting industry. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book.
          </Description>
          <p className="text-2xl text-left mb-6 w-2/3"></p>
        </div>

      </div>
      
    </section>
  );
}
