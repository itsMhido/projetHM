
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import { Map, Book, Search } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth().authState;
  const recipes = localStorageService.getRecipes().slice(0, 3); // Affiche seulement 3 recettes sur la page d'accueil
  
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900 flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/hero-moroccan-food.jpg')", 
            filter: "brightness(40%)"
          }} 
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Patrimoine Culinaire du Maroc
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Découvrez les trésors gastronomiques des 12 régions du royaume. Une bibliothèque virtuelle du goût marocain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/map">
              <Button size="lg" className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                <Map className="mr-2 h-5 w-5" /> Explorer la carte
              </Button>
            </Link>
            <Link to="/recipes">
              <Button size="lg" variant="outline" className="bg-white text-morocco-terracotta border-morocco-terracotta hover:bg-gray-100">
                <Book className="mr-2 h-5 w-5" /> Voir les recettes
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-morocco-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-morocco-dark">
            Explorez Notre Patrimoine Culinaire
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-morocco-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carte Interactive</h3>
              <p className="text-gray-600 mb-4">
                Explorez les 12 régions du Maroc et découvrez leurs spécialités culinaires.
              </p>
              <Link to="/map">
                <Button className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                  Découvrir
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-morocco-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recettes Authentiques</h3>
              <p className="text-gray-600 mb-4">
                Accédez à notre collection de recettes traditionnelles avec leurs variations locales.
              </p>
              <Link to="/recipes">
                <Button className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                  Explorer
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-morocco-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche Avancée</h3>
              <p className="text-gray-600 mb-4">
                Trouvez des recettes par nom, ingrédients, région ou catégorie.
              </p>
              <Link to="/search">
                <Button className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                  Rechercher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="py-16 zellige-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-morocco-dark">
            Recettes à découvrir
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Un aperçu de notre collection de recettes traditionnelles marocaines.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="moroccan-card overflow-hidden">
                <img
                  src={recipe.imageUrl || "/placeholder-food.jpg"}
                  alt={recipe.name}
                  className="w-full h-56 object-cover"
                />
                <CardContent className="p-5">
                  <h3 className="font-semibold text-xl mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Région: {localStorageService.getRegions().find(r => r.id === recipe.regionId)?.name}</p>
                  <p className="line-clamp-3 text-gray-700 mb-4">
                    {recipe.description}
                  </p>
                  <Link to={`/recipes/${recipe.id}`}>
                    <Button variant="outline" className="w-full border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white">
                      Voir la recette
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/recipes">
              <Button className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                Voir toutes les recettes
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-morocco-terracotta text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Participez à la préservation du patrimoine
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {isAuthenticated 
              ? "Contribuez en proposant des variantes de recettes traditionnelles et en partageant votre savoir."
              : "Créez un compte pour contribuer à notre collection de recettes et participer à la communauté."}
          </p>
          
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" className="bg-white text-morocco-terracotta hover:bg-morocco-light">
                Rejoindre la communauté
              </Button>
            </Link>
          )}
          
          {isAuthenticated && (
            <Link to="/recipes">
              <Button size="lg" className="bg-white text-morocco-terracotta hover:bg-morocco-light">
                Proposer une variante
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
