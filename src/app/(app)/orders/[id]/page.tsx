import { Metadata } from "next";
import ClientPage from "./ClientPage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Order Details – GokaFood',
    description: 'View detailed information about your GokaFood order including items, delivery status, and payment details.',
    keywords: ['order details', 'order tracking', 'order status', 'delivery details', 'GokaFood order'],
    openGraph: {
      title: 'Order Details – GokaFood',
      description: 'Track your GokaFood order and view details.',
      type: 'website',
    },
  };
}

export default function Page() {
  return <ClientPage />;
}
