import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin", "cyrillic", "latin-ext"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-cormorant'
});

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic", "latin-ext"], 
  variable: '--font-montserrat'
});

const greatVibes = Great_Vibes({ 
  subsets: ["latin", "latin-ext"], 
  weight: ["400"],
  variable: '--font-great-vibes'
});

export const metadata: Metadata = {
  title: {
    default: "AF Hotel, Aqua Park & AF Park - Rəsmi Sayt | Novxanı, Bakı",
    template: "%s | AF Hotel & Aqua Park - Rəsmi Sayt"
  },
  description: "Baku və Novxanıda ən yaxşı ailəvi istirahət mərkəzi! AF Hotel, ən böyük Aqua Park, lüks otaqlar və AF Park (Amusement Park). Booking.com-dan daha ucuz qiymətə birbaşa rəsmi saytdan bron edin və qazanın.",
  keywords: [
    "AF Hotel", "af hotel novxani", "af hotel aqua park", "af hotel rəsmi sayt", "af park",
    "novxani istirahet", "novxani hotel", "novxani resort", "istirahət mərkəzi", 
    "baku hotel", "baku resort", "aqua park baku", "su parkı", "hovuzlu hotel",
    "ailəvi istirahət", "atraksionlar", "af hotel qiymetleri", "af hotel əlaqə", 
    "luxury resort baku", "af hotel novkhani booking", "af hotel azerbaijan"
  ],
  authors: [{ name: "AF Hotel & Aqua Park Resort", url: "https://afhotel.az" }],
  creator: "AF Hotel & Aqua Park Resort",
  publisher: "AF Hotel & Aqua Park Resort",
  metadataBase: new URL("https://afhotel.az"),
  alternates: {
    canonical: 'https://afhotel.az',
    languages: {
      'az-AZ': 'https://afhotel.az',
      'en-US': 'https://afhotel.az?lang=en',
      'ru-RU': 'https://afhotel.az?lang=ru',
    },
  },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    alternateLocale: ["en_US", "ru_RU"],
    url: "https://afhotel.az",
    siteName: "AF Hotel, Aqua Park & AF Park | İstirahət və Əyləncə",
    title: "AF Hotel, Aqua Park & AF Park - Rəsmi Sayt | Novxanıda İstirahət",
    description: "Novxanıda ən yaxşı otel və aquapark. Booking.com yerinə birbaşa rəsmi saytdan bron edib daha ucuz qiymətlər əldə edin. Hər yaş qrupu üçün mükəmməl istirahət.",
    images: [
      {
        url: "/AF-hero.jpg",
        width: 1200,
        height: 630,
        alt: "AF Hotel, Aqua Park & AF Park Complex - Resort and Amusement Park in Baku",
      },
      {
        url: "/AF-aqua.jpg",
        width: 1200,
        height: 630,
        alt: "AF Aqua Park & AF Park - Water Park and Wonderland in Novkhani",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AF Hotel, Aqua Park & AF Park | Novxanı İstirahət Mərkəzi",
    description: "AF Hotel & Aqua Park, eləcə də möhtəşəm AF Park ilə əyləncə və rahat istirahət - hamısı bir yerdə!",
    images: ["/AF-hero.jpg"],
    creator: "@AFHotelBaku",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-new.png",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'Resort', 'AmusementPark'],
    name: 'AF Hotel, Aqua Park & AF Park',
    alternateName: ['AF Hotel', 'AF Park', 'AF Hotel & Aqua Park'],
    description: 'Baku və Novxanıda ən yaxşı ailəvi istirahət mərkəzi. AF Hotel, Aqua Park və attraksionlarla dolu AF Park.',
    url: 'https://afhotel.az',
    logo: 'https://afhotel.az/loqo-af.png',
    image: 'https://afhotel.az/AF-hero.jpg',
    telephone: '+994502233285',
    priceRange: '$$',
    starRating: { '@type': 'Rating', ratingValue: '4' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1350'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Novkhani',
      addressRegion: 'Baku',
      addressCountry: 'AZ',
      streetAddress: 'AF Hotel & Aqua Park Complex',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.5833',
      longitude: '50.1000',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'AF Park (Amusement Park)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Aqua Park', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Swimming Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true }
    ],
    sameAs: [
      'https://www.instagram.com/afhotel.az', 
      'https://www.facebook.com/afhotel',
      'https://www.tiktok.com/@afhotel'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+994502233285',
      contactType: 'customer service',
      availableLanguage: ['Azerbaijani', 'English', 'Russian']
    },
    makesOffer: {
      '@type': 'Offer',
      priceCurrency: 'AZN',
      price: '50.00',
      availability: 'https://schema.org/InStock',
      url: 'https://afhotel.az/booking',
      itemOffered: {
        '@type': 'Service',
        name: 'Hotel Booking - Best Rate Guarantee'
      }
    }
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AF Hotel, Aqua Park & AF Park Complex',
    url: 'https://afhotel.az',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://afhotel.az/rooms?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="az" className={`${cormorant.variable} ${montserrat.variable} ${greatVibes.variable}`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, webSiteJsonLd]) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden w-full bg-(--color-hotel-light) text-(--color-hotel-dark)">
        <Providers>
          <Header />
          <main className="flex-1 w-full flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}