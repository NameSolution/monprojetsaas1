import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';

const EditMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [allergens, setAllergens] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchMenu = async () => {
    const data = await api(`/api/menus/${id}`);
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    await api(`/api/menus/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ name, price: parseFloat(price), allergens, imageUrl })
    });
    setName(''); setPrice(''); setAllergens(''); setImageUrl('');
    fetchMenu();
  };

  const toggleItem = async (itemId, available) => {
    await api(`/api/menus/${id}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ available: !available })
    });
    fetchMenu();
  };

  if (!menu) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edition du menu</h1>
      <form onSubmit={addItem} className="space-y-2">
        <input className="border p-1" placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="border p-1" placeholder="Prix" value={price} onChange={e=>setPrice(e.target.value)} required />
        <input className="border p-1" placeholder="Allergènes" value={allergens} onChange={e=>setAllergens(e.target.value)} />
        <input className="border p-1" placeholder="Image URL" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
        <button className="bg-green-500 text-white px-2 py-1" type="submit">Ajouter</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.items.map(item => (
          <div key={item.id} className="border p-2 space-y-2">
            {item.imageUrl && <img src={item.imageUrl} alt="" className="h-32 w-full object-cover" />}
            <h2 className="font-bold">{item.name} - {item.price.toFixed(2)} €</h2>
            <p className="text-sm">{item.allergens}</p>
            <button className="bg-blue-500 text-white px-2 py-1" onClick={() => toggleItem(item.id, item.available)}>
              {item.available ? 'Indisponible' : 'Disponible'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditMenu;
