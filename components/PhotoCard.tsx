export default function PhotoCard({ src }: { src: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow">
      <img
        src={src}
        alt="Foto do evento"
        className="w-full h-48 object-cover"
      />
      <a href={src} download className="absolute inset-0 flex items-center justify-center text-white opacity-0 hover:opacity-100 bg-black bg-opacity-40 transition-opacity">
        Baixar
      </a>
    </div>
  );
}
