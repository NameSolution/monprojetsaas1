
import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SuperAdminAnalyticsView = () => {
    const { data, loading } = useSuperAdminData('analytics');
    
    const COLORS = ['hsl(var(--primary))', 'hsl(262 85% 58%)', 'hsl(30, 95%, 55%)', 'hsl(145, 63%, 49%)']; 
    
    const handleExport = () => {
        toast({
            title: "Exportation des Données",
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀",
        });
    };

    const handleFilter = () => {
        toast({
            title: "Filtrage des Données",
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀",
        });
    };

    if (loading || !data) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-24 rounded-xl" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="h-80 rounded-xl lg:col-span-2" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }
    
    const stats = data?.stats || {};
    const conversationsData = data?.conversationsData || [];
    const plansData = data?.plansData || [];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="dashboard-card rounded-xl p-6">
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Analytics Globales</h2>
                        <p className="text-muted-foreground">Vue d'ensemble de l'utilisation de la plateforme.</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleFilter}>
                            <Filter className="w-4 h-4 mr-2" /> Filtrer
                        </Button>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" /> Exporter
                        </Button>
                    </div>
                 </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="dashboard-card rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Volume de conversations par mois</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={conversationsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} 
                                cursor={{fill: 'hsl(var(--accent))'}}
                            />
                             <Bar dataKey="conversations" name="Conversations" fill="url(#colorAnalyticsSuper)" />
                             <defs>
                                <linearGradient id="colorAnalyticsSuper" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="dashboard-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Répartition des plans</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={plansData} 
                                cx="50%" 
                                cy="50%" 
                                labelLine={false} 
                                outerRadius={110} 
                                fill="hsl(var(--primary))" 
                                dataKey="value" 
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                stroke="hsl(var(--border))"
                            >
                                {plansData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default SuperAdminAnalyticsView;
