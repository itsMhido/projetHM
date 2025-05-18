import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { Recipe, Region } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "ingredient" | "region">("name");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  
  // Récupérer toutes les recettes et régions
  useEffect(() => {
    setRecipes(localStorageService.getRecipes());
    setRegions(localStorageService.getRegions());
  }, []);
  
  // Récupérer tous les ingrédients uniques de toutes les recettes
  const getAllIngredients = (): string[] => {
    const allIngredients = new Set<string>();
    
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        // Récupérer le premier mot de l'ingrédient (en général le nom principal)
        const mainIngredient = ingredient.split(' ')[0].toLowerCase();
        if (mainIngredient.length > 3) { // Ignorer les mots très courts
          allIngredients.add(mainIngredient);
        }
      });
    });
    
    return Array.from(allIngredients).sort();
  };
  
  // Fonction de recherche
  const handleSearch = () => {
    let results: Recipe[] = [];
    
    if (!searchTerm && searchType !== "region") {
      // Si aucun terme n'est saisi et qu'on ne cherche pas par région, montrer toutes les recettes
      results = [...recipes];
    } else {
      switch (searchType) {
        case "name":
          results = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipe.nameAr && recipe.nameAr.includes(searchTerm))
          );
          break;
        
        case "ingredient":
          results = recipes.filter(recipe =>
            recipe.ingredients.some(ingredient =>
              ingredient.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
          break;
        
        case "region":
          results = recipes.filter(recipe => recipe.regionId === selectedRegion);
          break;
        
        default:
          results = [...recipes];
      }
    }
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchTerm("");
    setSearchType("name");
    setSelectedRegion("");
    setSearchResults([]);
    setHasSearched(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 text-morocco-dark">Rechercher une recette</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trouvez des recettes par nom, ingrédient ou région. Explorez la richesse du patrimoine culinaire marocain.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-10 max-w-4xl mx-auto">
        <Tabs defaultValue="name" onValueChange={(value) => setSearchType(value as "name" | "ingredient" | "region")}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="name">Par nom</TabsTrigger>
            <TabsTrigger value="ingredient">Par ingrédient</TabsTrigger>
            <TabsTrigger value="region">Par région</TabsTrigger>
          </TabsList>
          
          <TabsContent value="name" className="space-y-4">
            <div>
              <label htmlFor="nameSearch" className="text-sm font-medium text-gray-700 block mb-1">
                Nom de la recette
              </label>
              <Input
                id="nameSearch"
                type="text"
                placeholder="Tajine, couscous, pastilla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ingredient" className="space-y-4">
            <div>
              <label htmlFor="ingredientSearch" className="text-sm font-medium text-gray-700 block mb-1">
                Ingrédient
              </label>
              <Input
                id="ingredientSearch"
                type="text"
                placeholder="Poulet, amandes, citron confit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                list="ingredients-list"
              />
              <datalist id="ingredients-list">
                {getAllIngredients().map((ingredient, index) => (
                  <option key={index} value={ingredient} />
                ))}
              </datalist>
            </div>
          </TabsContent>
          
          <TabsContent value="region" className="space-y-4">
            <div>
              <label htmlFor="regionSearch" className="text-sm font-medium text-gray-700 block mb-1">
                Région
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="regionSearch">
                  <SelectValue placeholder="Sélectionnez une région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <div className="flex items-center justify-center mt-6 space-x-3">
            <Button
              onClick={handleSearch}
              className="bg-morocco-terracotta hover:bg-morocco-ocre text-white px-8"
            >
              <SearchIcon className="w-4 h-4 mr-2" /> Rechercher
            </Button>
            <Button
              variant="outline"
              onClick={resetSearch}
              className="border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
            >
              Réinitialiser
            </Button>
          </div>
        </Tabs>
      </div>
      
      {/* Résultats de recherche */}
      {hasSearched && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-morocco-dark">
            Résultats de recherche {searchResults.length > 0 ? `(${searchResults.length})` : ""}
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((recipe) => (
                <Card key={recipe.id} className="moroccan-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl || "/placeholder-food.jpg"}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {regions.find(region => region.id === recipe.regionId)?.name}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2">{recipe.name}</h3>
                    
                    <p className="line-clamp-2 text-gray-700 mb-3 text-sm">
                      {recipe.description}
                    </p>
                    
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
              <p className="text-gray-500 mb-6">
                Essayez de modifier votre recherche ou d'utiliser des termes différents.
              </p>
              <Button 
                variant="outline" 
                onClick={resetSearch} 
                className="border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
