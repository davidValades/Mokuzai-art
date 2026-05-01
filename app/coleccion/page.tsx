import CollectionsGrid from "@/components/CollectionsGrid";

export default function AllCollectionsPage() {
  return (
    <div className="min-h-screen bg-stone-serene pt-24 pb-12">
      {/* 
        Reutilizamos nuestro Grid Asimétrico. 
        Al estar en su propia página, le damos espacio para respirar 
        con un padding superior para que no choque con el Header.
      */}
      <CollectionsGrid />
    </div>
  );
}