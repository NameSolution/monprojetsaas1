import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api.js';

const Landing = () => {
  const [name, setName] = useState('');
  const [created, setCreated] = useState(null);
  const navigate = useNavigate();

  const createMenu = async (e) => {
    e.preventDefault();
    const data = await api('/api/menus', { method: 'POST', body: JSON.stringify({ name }) });
    setCreated(data);
  };

  if (created) {
    const adminUrl = `${window.location.origin}/edit/${created.id}`;
    const publicUrl = `${window.location.origin}/menu/${created.id}`;
    return (
      <div className="p-4 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Menu créé !</h1>
        <p>URL admin : <a className="text-blue-500" href={adminUrl}>{adminUrl}</a></p>
        <p>URL publique : <a className="text-blue-500" href={publicUrl}>{publicUrl}</a></p>
        <div className="flex justify-center">
          <QRCodeSVG value={publicUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Créer mon menu</h1>
      <form onSubmit={createMenu} className="space-y-4">
        <input
          className="border p-2"
          placeholder="Nom du restaurant"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">Créer</button>
      </form>
    </div>
  );
};

export default Landing;
