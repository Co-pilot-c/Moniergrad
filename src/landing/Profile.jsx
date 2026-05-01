import { HashLink } from "react-router-hash-link";
import Angkatan from "../pages/Angkatan";
import { useLocation } from "react-router-dom";
import Card from "../components/molecules/Card";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const el = document.getElementById("angkatan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const { state } = useLocation();
  const data = state?.data;

  if (!data) {
    return <p>Data tidak ditemukan</p>;
  }
  return (
    <>
      <section id="angkatan">
        <Angkatan {...data} mode="detail" />
      </section>
      <section id="anggota">
        <div className="mt-10 grid place-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-10">
          {data.members.map((item, i) => (
            <Card {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
