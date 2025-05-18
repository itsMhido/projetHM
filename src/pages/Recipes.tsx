
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { Recipe, Region } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  useEffect(() => {
    // Charger les recettes et les régions
    const loadedRecipes = localStorageService.getRecipes();
    const loadedRegions = localStorageService.getRegions();
    
    setRecipes(loadedRecipes);
    setFilteredRecipes(loadedRecipes);
    setRegions(loadedRegions);
  }, []);
  
  useEffect(() => {
    // Filtrer les recettes en fonction des critères
    let result = [...recipes];
    
    // Filtre par terme de recherche (nom)
    if (searchTerm) {
      result = result.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par région
    if (regionFilter) {
      result = result.filter(recipe => recipe.regionId === regionFilter);
    }
    
    // Filtre par catégorie
    if (categoryFilter) {
      result = result.filter(recipe => recipe.category === categoryFilter);
    }
    
    setFilteredRecipes(result);
  }, [searchTerm, regionFilter, categoryFilter, recipes]);
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setRegionFilter("");
    setCategoryFilter("");
  };
  
  // Obtenir le nom de la région à partir de son ID
  const getRegionName = (regionId: string): string => {
    const region = regions.find(r => r.id === regionId);
    return region ? region.name : "Inconnu";
  };
  
  // Traduction des catégories pour l'affichage
  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      'plat': 'Plat principal',
      'dessert': 'Dessert',
      'boisson': 'Boisson',
      'entrée': 'Entrée'
    };
    
    return categories[category] || category;
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-morocco-dark text-center">
        Découvrez nos Recettes Traditionnelles
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        Explorez notre collection de recettes authentiques marocaines, transmises de génération en génération.
      </p>
      
      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-morocco-terracotta">
        <h2 className="text-xl font-semibold mb-4 text-morocco-dark">Filtrer les recettes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-1">
              Rechercher par nom
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Tajine, couscous, pastilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="region" className="text-sm font-medium text-gray-700 block mb-1">
              Filtrer par région
            </label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les régions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-1">
              Filtrer par catégorie
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                <SelectItem value="plat">Plat principal</SelectItem>
                <SelectItem value="entrée">Entrée</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
                <SelectItem value="boisson">Boisson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
      
      {/* Liste des recettes */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="moroccan-card overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src={recipe.imageUrl || "/placeholder-food.jpg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-morocco-terracotta text-white text-xs px-2 py-1 rounded">
                    {getCategoryName(recipe.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getRegionName(recipe.regionId)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-xl mb-2">{recipe.name}</h3>
                {recipe.nameAr && (
                  <h4 className="text-sm text-morocco-dark mb-2 font-medium">{recipe.nameAr}</h4>
                )}
                
                <p className="line-clamp-3 text-gray-700 mb-3 text-sm">
                  {recipe.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span>⏱️ {recipe.preparationTime + recipe.cookingTime} min</span>
                  <span>👥 {recipe.servings} pers.</span>
                  <span>
                    {recipe.difficulty === 'facile' && '🟢 Facile'}
                    {recipe.difficulty === 'moyen' && '🟠 Moyen'}
                    {recipe.difficulty === 'difficile' && '🔴 Difficile'}
                  </span>
                </div>
                
                <Link to={`/recipes/${recipe.id}`}>
                  <Button
                    className="w-full bg-morocco-terracotta hover:bg-morocco-ocre text-white"
                  >
                    Voir la recette
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg 
            className="w-16 h-16 text-gray-400 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune recette trouvée</h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters} 
            className="mt-4 border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default Recipes;
