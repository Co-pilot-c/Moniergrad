import bg from "../assets/images/home.jpeg";
import Tittle from "../components/atoms/Tittle.jsx";
import Button from "../components/atoms/Button.jsx";
import Description from "../components/atoms/Description.jsx";

export default function Home() {
  return (
    <section
      id="home"
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="bg-white/70 w-full h-full absolute top-0 left-0"></div>

      {/* Content */}
      <div className="relative text-center text-gray-900 px-4">
        <Tittle>Selamat Datang</Tittle>

        <Description>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </Description>

        <Button href="#about">About Us</Button>
      </div>
    </section>
  );
}
