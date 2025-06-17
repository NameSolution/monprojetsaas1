import React from 'react';
import UsersView from './UsersView.jsx';
import HotelsView from './HotelsView.jsx';

const ClientsView = () => (
  <div className="space-y-10">
    <UsersView />
    <HotelsView />
  </div>
);

export default ClientsView;
