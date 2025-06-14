
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Download, Search, Filter, FileText } from 'lucide-react';
import { useSuperAdminData } from '@/hooks/useSuperAdminData';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const SuperAdminBillingView = () => {
    const { data: initialInvoices, loading } = useSuperAdminData('billing');
    const [invoices, setInvoices] = useState(initialInvoices);
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        if (!loading) {
            setInvoices(initialInvoices);
        }
    }, [initialInvoices, loading]);

    const filteredInvoices = invoices?.filter(invoice => 
        invoice.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleExportCSV = () => {
        toast({ 
            title: "Export CSV", 
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀"
        });
    };
    
    const handleDownloadPDF = (invoiceId) => {
        toast({ 
            title: "Téléchargement PDF...", 
            description: `🚧 Facture ${invoiceId} - fonctionnalité à venir ! 🚀`
        });
    };
    
    const handleFilter = () => {
        toast({
            title: "Filtrage des Factures",
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain prompt ! 🚀",
        });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dashboard-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Facturation</h2>
                        <p className="text-muted-foreground">Consultez et gérez les factures de vos clients.</p>
                    </div>
                    <Button variant="outline" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter en CSV
                    </Button>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Rechercher par ID facture ou nom d'hôtel..." 
                            className="pl-10 bg-secondary border-border text-foreground" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={handleFilter}><Filter className="w-4 h-4 mr-2" />Filtrer</Button>
                </div>


                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">ID Facture</th>
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">Hôtel</th>
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">Montant</th>
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">Date</th>
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">Statut</th>
                                <th className="text-left text-muted-foreground font-medium py-3 px-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="py-4 px-2" colSpan={6}><Skeleton className="h-6 w-full" /></td>
                                    </tr>
                                ))
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-secondary/50">
                                        <td className="py-4 px-2 text-foreground">{invoice.id}</td>
                                        <td className="py-4 px-2 text-muted-foreground">{invoice.hotel}</td>
                                        <td className="py-4 px-2 text-muted-foreground">{invoice.amount}</td>
                                        <td className="py-4 px-2 text-muted-foreground">{invoice.date}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${invoice.status === 'Payée' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>{invoice.status}</span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice.id)}>
                                                <FileText className="w-3 h-3 mr-1" />
                                                PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {filteredInvoices.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted-foreground">Aucune facture trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SuperAdminBillingView;
