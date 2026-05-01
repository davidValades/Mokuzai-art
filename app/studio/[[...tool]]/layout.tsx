export const metadata = {
  title: "Mokuzai Art | Studio",
  description: "El taller interno de gestión de obras.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* 
        Le quitamos márgenes y padding para que 
        el panel de Sanity ocupe toda la pantalla de forma nativa. 
      */}
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
