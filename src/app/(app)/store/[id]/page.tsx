import { Metadata } from "next";
import ClientPage from "./ClientPage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Store Details – GokaFood',
    description: 'View all meals from this verified restaurant. Check ratings, menu items, and place your order on GokaFood.',
    keywords: ['store details', 'restaurant menu', 'verified restaurant', 'order from restaurant', 'GokaFood store'],
    openGraph: {
      title: 'Restaurant Details – GokaFood',
      description: 'Browse menu items and order from this restaurant on GokaFood.',
      type: 'website',
      images: [
        {
          url: 'https://gokafood.com/images/gokafood.jpeg',
          width: 1200,
          height: 630,
          alt: 'Restaurant details',
        },
      ],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <ClientPage params={params} />;
}
