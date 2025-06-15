
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Bot, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, loading, resetPassword } = useAuth();
  const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const { success, user, error } = await login(formData.email, formData.password);
        if (success && user) {
          if (user.role === 'superadmin') {
            navigate('/superadmin');
          } else if (['admin', 'manager'].includes(user.role) && user.hotel_id) {
            navigate('/client');
          } else if (['admin', 'manager'].includes(user.role) && !user.hotel_id) {
            toast({variant: "destructive", title: "Configuration Requise (Simulée)", description: "Votre compte administrateur n'est lié à aucun hôtel. Contactez le Superadmin."});
            navigate('/login');
          } else {
            toast({variant: "destructive", title: "Accès non configuré (Simulé)", description: "Votre rôle ou hôtel n'est pas correctement configuré."});
            navigate('/login');
          }
        } else if (!success) {
          toast({ variant: "destructive", title: "Erreur de connexion", description: error || "Identifiants invalides" });
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      }
  };
  
  const handlePasswordResetRequest = async () => {
    if (!formData.email) {
        toast({variant: "destructive", title: "Email Requis", description: "Veuillez entrer votre email pour réinitialiser le mot de passe."});
        return;
    }
    try {
        await resetPassword(formData.email);
    } catch (error) {
        // Error toast handled by resetPassword in authContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background pages-LoginPage__bg-background">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors pages-LoginPage__text-muted-foreground pages-LoginPage__hover-text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Bot className="w-10 h-10 text-primary pages-LoginPage__text-primary" />
            <span className="text-2xl font-bold gradient-text">HotelBot AI</span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-2 pages-LoginPage__text-foreground">
            Connexion
          </h2>
          <p className="text-muted-foreground pages-LoginPage__text-muted-foreground">
            Accédez à votre dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground pages-LoginPage__text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 bg-secondary border-border text-foreground pages-LoginPage__bg-secondary pages-LoginPage__border-border pages-LoginPage__text-foreground"
                placeholder="superadmin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground pages-LoginPage__text-foreground">Mot de passe</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-secondary border-border text-foreground pr-10 pages-LoginPage__bg-secondary pages-LoginPage__border-border pages-LoginPage__text-foreground"
                  placeholder="password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground pages-LoginPage__text-muted-foreground pages-LoginPage__hover-text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-bg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se Connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-sm text-primary hover:text-primary/80 transition-colors pages-LoginPage__text-primary pages-LoginPage__hover-text-primary-80"
              onClick={(e) => { e.preventDefault(); handlePasswordResetRequest(); }}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground pages-LoginPage__text-muted-foreground"
        >
<p className="italic text-sm opacity-70">
  Compte requis : demandez au Superadmin.
</p>

           <p className="mt-2">
            Besoin d'aide ? {' '}
            <a 
              href="#" 
              className="text-primary hover:text-primary/80 transition-colors pages-LoginPage__text-primary pages-LoginPage__hover-text-primary-80"
              onClick={(e) => { e.preventDefault(); toast({ title: "Support (Simulé)", description: "La page de contact est en construction." })}}
            >
              Contactez le support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
