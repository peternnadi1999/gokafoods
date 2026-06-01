import { Metadata } from "next";
import ClientPage from "./ClientPage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: 'Food Details – GokaFood',
    description: 'View detailed information about this delicious meal. Check ingredients, ratings, reviews, and order now on GokaFood.',
    keywords: ['food details', 'meal information', 'food reviews', 'order food', 'GokaFood product'],
    openGraph: {
      title: 'Food Details – GokaFood',
      description: 'Discover this amazing meal on GokaFood. Fast delivery, great taste.',
      type: 'website',
      images: [
        {
          url: 'https://gokafood.com/images/gokafood.jpeg',
          width: 1200,
          height: 630,
          alt: 'Food product details',
        },
      ],
    },
  };
}

export default function Page() {
  return <ClientPage />;
}
