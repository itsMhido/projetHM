
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-morocco-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold">CuisineMaghreb</h3>
            <p className="text-sm text-gray-300">
              Préservation et valorisation du patrimoine culinaire immatériel du Maroc.
              Découvrez les trésors gastronomiques des 12 régions du royaume.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-gray-300 hover:text-white transition">
                  Carte interactive
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-sm text-gray-300 hover:text-white transition">
                  Recettes
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-300 hover:text-white transition">
                  Recherche
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition">
                  À propos du projet
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CuisineMaghreb - Tous droits réservés</p>
          <p className="mt-2">
            Application développée avec React.js et Tailwind CSS pour la valorisation du patrimoine culinaire immatériel du Maroc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
