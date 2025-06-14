
import React from 'react';
import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleLinkClick = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  const footerLinks = {
    Produit: [
      { name: 'Fonctionnalités', href: '#features' },
      { name: 'Tarifs', href: '#pricing' },
      { name: 'Documentation', href: '/client/documentation' },
    ],
    Support: [
      { name: "Centre d'aide", href: '#' },
      { name: 'Contact', href: '#contact' },
      { name: 'Statut', href: '#' },
    ],
    Légal: [
      { name: 'Mentions légales', href: '#' },
      { name: 'CGU', href: '#' },
      { name: 'Confidentialité', href: '#' },
    ],
  };

  return (
    <footer className="bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Bot className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold gradient-text">HotelBot AI</span>
            </Link>
            <p className="text-muted-foreground">
              L'assistant virtuel nouvelle génération pour hôtels, 100% local et
              sécurisé.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="font-semibold text-foreground mb-4 block">{title}</p>
              <ul className="space-y-2 text-muted-foreground">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="hover:text-primary transition-colors"
                      onClick={(e) => {
                          if (link.href.startsWith('#')) {
                              e.preventDefault();
                              handleLinkClick(link.href);
                          }
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HotelBot AI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
