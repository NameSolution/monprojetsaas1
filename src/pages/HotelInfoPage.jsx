import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHotelConfigBySlug } from '@/services/chatbotService';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

const HotelInfoPage = () => {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchHotelConfigBySlug(slug);
        setHotel(data);
      } catch (err) {
        console.error('Failed to load hotel info', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-64" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Hôtel introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-6 bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center space-x-4">
          {hotel.logo_url ? (
            <img src={hotel.logo_url} alt="Logo" className="h-12 w-12 object-contain" />
          ) : (
            <Bot className="h-10 w-10" />
          )}
          <h1 className="text-2xl font-bold">{hotel.name}</h1>
        </div>
      </header>
      <main className="container mx-auto p-6 space-y-6">
        {hotel.description && <p>{hotel.description}</p>}
        {Array.isArray(hotel.menu_items) && hotel.menu_items.length > 0 && (
          <nav className="space-y-2">
            {hotel.menu_items.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                className="block text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <div className="space-y-1">
          {hotel.address && <p>Adresse: {hotel.address}</p>}
          {hotel.phone && <p>Téléphone: {hotel.phone}</p>}
          {hotel.email && <p>Email: {hotel.email}</p>}
          {hotel.booking_link && (
            <a
              href={hotel.booking_link}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Réserver
            </a>
          )}
        </div>
      </main>
    </div>
  );
};

export default HotelInfoPage;
