import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: 'Restaurante La Tentación | Gastrobar en Sevilla Este',
  description:
    'Gastrobar de cocina mediterránea contemporánea y fusión en Sevilla Este. Tapas de autor, carnes maduradas, arroces melosos, brioches y postres caseros en Calle Profesor Manuel Clavero Arévalo, 9.',
  keywords: [
    'Restaurante La Tentación',
    'La Tentación Sevilla Este',
    'Gastrobar Sevilla Este',
    'Comer en Sevilla Este',
    'Tapas creativas Sevilla',
    'Arroz meloso carrillada Sevilla',
    'Restaurante Sevilla Este',
  ],
  authors: [{ name: 'Restaurante La Tentación' }],
  openGraph: {
    title: 'Restaurante La Tentación | Gastrobar en Sevilla Este',
    description:
      'Una experiencia para dejarse llevar. Cocina mediterránea con personalidad, sabores que sorprenden y momentos que merecen repetirse.',
    url: 'https://latentacionsevillaeste.es',
    siteName: 'Restaurante La Tentación',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1C1A]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
