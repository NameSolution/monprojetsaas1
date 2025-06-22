import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';

const PublicMenu = () => {
  const { id } = useParams();
  const [items, setItems] = useState(null);

  const fetchItems = async () => {
    const data = await api(`/api/menus/${id}/public`);
    setItems(data.items);
  };

  useEffect(() => { fetchItems(); }, [id]);

  if (!items) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Notre Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border p-2 space-y-2 bg-white">
            {item.imageUrl && <img src={item.imageUrl} alt="" className="h-32 w-full object-cover" />}
            <h2 className="font-bold">{item.name} - {item.price.toFixed(2)} €</h2>
            <p className="text-sm">{item.allergens}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicMenu;
