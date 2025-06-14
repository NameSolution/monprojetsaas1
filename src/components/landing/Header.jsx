
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">HotelBot AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
              >
                {link.name}
              </a>
            ))}
             <Button asChild variant="outline">
              <Link to="/login">Connexion</Link>
            </Button>
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-effect border-t border-border"
        >
          <nav className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false)
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="block text-muted-foreground hover:text-primary"
              >
                {link.name}
              </a>
            ))}
            <Button asChild variant="outline" className="w-full">
               <Link to="/login">Connexion</Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
