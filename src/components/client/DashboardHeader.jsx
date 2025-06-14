
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Bell } from 'lucide-react';

const DashboardHeader = ({ title, subtitle }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="bg-card/80 backdrop-filter backdrop-blur-lg border-b border-border px-6 py-4 components-client-DashboardHeader__bg-card-80 components-client-DashboardHeader__border-border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground components-client-DashboardHeader__text-foreground">{title}</h1>
          <p className="text-muted-foreground components-client-DashboardHeader__text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'status-online' : 'status-offline'}`}></div>
            <span className={`text-sm font-medium ${isActive ? 'text-green-500 components-client-DashboardHeader__text-green-500' : 'text-destructive components-client-DashboardHeader__text-destructive'}`}>
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => toast({ title: "Notifications", description: "Aucune nouvelle notification." })}
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
