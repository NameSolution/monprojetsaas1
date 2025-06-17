
import React from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/client/DashboardHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useClientData } from '@/hooks/useClientData';
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsView = () => {
    const { analytics, loading } = useClientData();
    const { conversationData = [], topThemes = [] } = analytics || {};

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


    return (
        <>
            <DashboardHeader 
                title="Analytics"
                subtitle="Analysez les performances de votre assistant virtuel"
            />
            <main className="p-6">
                 <div className="flex justify-end space-x-2 mb-6">
                    <Button variant="outline" onClick={handleFilter}>
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrer par date
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter les données (CSV)
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dashboard-card rounded-xl p-6 lg:col-span-2"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Volume de conversations (7 derniers jours)</h3>
                        {loading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={conversationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--card))', 
                                            border: '1px solid hsl(var(--border))', 
                                            color: 'hsl(var(--foreground))' 
                                        }} 
                                        cursor={{fill: 'hsl(var(--accent))'}}
                                    />
                                    <Bar dataKey="conversations" name="Conversations" fill="url(#colorAnalyticsClient)" />
                                     <defs>
                                        <linearGradient id="colorAnalyticsClient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(240, 80%, 65%)" stopOpacity={0.8}/>
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="dashboard-card rounded-xl p-6 lg:col-span-1"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Top 5 des thèmes</h3>
                         {loading ? (
                            <div className="space-y-4">
                                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                            </div>
                         ) : (
                            <div className="space-y-4">
                                {topThemes.map((theme, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-foreground mb-1 text-sm">
                                            <span>{theme.name}</span>
                                            <span>{theme.count}</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2.5">
                                            <div 
                                                className="bg-gradient-to-r from-primary to-blue-500 h-2.5 rounded-full" 
                                                style={{ width: `${(theme.count / (topThemes[0]?.count || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                    </motion.div>
                </div>
            </main>
        </>
    );
};

export default AnalyticsView;
