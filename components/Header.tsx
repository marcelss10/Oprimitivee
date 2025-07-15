import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-black to-gray-900 pt-6 pb-10 px-6 shadow-md relative">
      {/* Botão flutuante no canto superior direito */}
      <div className="absolute top-6 right-6">
        <Link
          href="https://wa.me/5541987936037"
          target="_blank"
          className="bg-green-600 text-white px-6 py-2 rounded-full text-sm md:text-base hover:bg-green-700 transition"
        >
          Precisa de um fotógrafo?
        </Link>
      </div>

      {/* Logo centralizada */}
      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="Primitive Logo"
          width={600}
          height={160}
          className="object-contain drop-shadow-lg"
        />
      </div>
    </header>
  );
}
