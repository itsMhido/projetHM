
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, User, LogOut, Home, Map, Search, Book } from "lucide-react";

const Navbar = () => {
  const { authState, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-morocco-terracotta text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <span className="text-xl font-poppins font-bold">CuisineMaghreb</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Link>
            
            <Link 
              to="/map" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/map") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Map className="w-4 h-4 mr-1" />
              Carte
            </Link>
            
            <Link 
              to="/recipes" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/recipes") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Book className="w-4 h-4 mr-1" />
              Recettes
            </Link>
            
            <Link 
              to="/search" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/search") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Search className="w-4 h-4 mr-1" />
              Recherche
            </Link>
            
            {isAdmin() && (
              <Link 
                to="/admin" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin") ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={closeMenu}
              >
                Admin
              </Link>
            )}
            
            {!authState.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="bg-white text-morocco-terracotta hover:bg-morocco-light">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="bg-morocco-safran text-morocco-dark hover:bg-morocco-ocre">
                    Inscription
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/profile") ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  onClick={closeMenu}
                >
                  <User className="w-4 h-4 mr-1" />
                  {authState.user?.username}
                </Link>
                
                <Button 
                  variant="ghost" 
                  className="hover:bg-white/10 p-2" 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" className="p-1" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-morocco-terracotta border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Home className="w-5 h-5 mr-2" />
              Accueil
            </Link>
            
            <Link 
              to="/map" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/map") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Map className="w-5 h-5 mr-2" />
              Carte
            </Link>
            
            <Link 
              to="/recipes" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/recipes") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Book className="w-5 h-5 mr-2" />
              Recettes
            </Link>
            
            <Link 
              to="/search" 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/search") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={closeMenu}
            >
              <Search className="w-5 h-5 mr-2" />
              Recherche
            </Link>
            
            {isAdmin() && (
              <Link 
                to="/admin" 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin") ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={closeMenu}
              >
                Admin
              </Link>
            )}
            
            {!authState.isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={closeMenu} className="col-span-1">
                  <Button variant="outline" className="w-full bg-white text-morocco-terracotta hover:bg-morocco-light">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu} className="col-span-1">
                  <Button className="w-full bg-morocco-safran text-morocco-dark hover:bg-morocco-ocre">
                    Inscription
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-white/10">
                <Link 
                  to="/profile" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/profile") ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5 mr-2" />
                  {authState.user?.username}
                </Link>
                
                <button 
                  className="flex items-center w-full px-3 py-2 mt-1 text-base font-medium rounded-md hover:bg-white/10 focus:outline-none"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
