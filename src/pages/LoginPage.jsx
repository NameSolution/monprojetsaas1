diff --git a/src/pages/LoginPage.jsx b/src/pages/LoginPage.jsx
index 6903411e71fea3fce0f470e181b75824a761346f..703c9ecdc039fe01ac4742794ce8aa72e7ba4aa1 100644
--- a/src/pages/LoginPage.jsx
+++ b/src/pages/LoginPage.jsx
@@ -1,67 +1,67 @@
 
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
 
-  const handleLogin = async (e) => {
-    e.preventDefault();
-    try {
-      const user = await login(formData.email, formData.password);
-      if (user) {
-        if (user.role === 'superadmin') {
-          navigate('/superadmin');
-        } else if (['admin', 'manager'].includes(user.role) && user.hotel_id) {
-          navigate('/client');
-        } else if (['admin', 'manager'].includes(user.role) && !user.hotel_id) {
-           toast({variant: "destructive", title: "Configuration Requise (Simulée)", description: "Votre compte administrateur n'est lié à aucun hôtel. Contactez le Superadmin."});
-           // logout(); // No need to logout, login failed or user is not fully configured
-           navigate('/login');
-        } else {
+    const handleLogin = async (e) => {
+      e.preventDefault();
+      try {
+        const { success, user, error } = await login(formData.email, formData.password);
+        if (success && user) {
+          if (user.role === 'superadmin') {
+            navigate('/superadmin');
+          } else if (['admin', 'manager'].includes(user.role) && user.hotel_id) {
+            navigate('/client');
+          } else if (['admin', 'manager'].includes(user.role) && !user.hotel_id) {
+            toast({variant: "destructive", title: "Configuration Requise (Simulée)", description: "Votre compte administrateur n'est lié à aucun hôtel. Contactez le Superadmin."});
+            navigate('/login');
+          } else {
             toast({variant: "destructive", title: "Accès non configuré (Simulé)", description: "Votre rôle ou hôtel n'est pas correctement configuré."});
-            // logout();
             navigate('/login');
+          }
+        } else if (!success) {
+          toast({ variant: "destructive", title: "Erreur de connexion", description: error || "Identifiants invalides" });
         }
+      } catch (error) {
+        toast({ variant: "destructive", title: "Erreur", description: error.message });
       }
-    } catch (error) {
-      // Error toast is handled by the login function in authContext
-    }
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
