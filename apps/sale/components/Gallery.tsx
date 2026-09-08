import { photos } from "@/lib/photos";

export default function Gallery() {
  if (!photos.length) return null;
  return (
    <section className="gallery" aria-label="Apartment photos">
      {photos.map((p, i) => (
        <figure key={p.src} className={i === 0 ? "lead" : ""}>
          <img src={p.src} alt={p.alt} loading={i === 0 ? "eager" : "lazy"} />
        </figure>
      ))}
    </section>
  );
}
