import NotificationDetailClient from './NotificationDetailClient';

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <NotificationDetailClient id={params.id} />;
}

export const dynamic = 'force-dynamic';
