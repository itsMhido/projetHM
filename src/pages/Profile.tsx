
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { localStorageService } from "../services/localStorageService";
import { Recipe, RecipeVariant } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Heart, User } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authState, isUser } = useAuth();
  const [userVariants, setUserVariants] = useState<RecipeVariant[]>([]);
  const [userVotes, setUserVotes] = useState<RecipeVariant[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    if (isUser() && authState.user) {
      const userId = authState.user.id;
      const allVariants = localStorageService.getRecipeVariants();
      const allRecipes = localStorageService.getRecipes();
      
      // Récupérer les variantes créées par l'utilisateur
      const variants = allVariants.filter(variant => variant.createdBy === userId);
      setUserVariants(variants);
      
      // Récupérer les variantes votées par l'utilisateur
      const votes = allVariants.filter(variant => variant.voterIds.includes(userId));
      setUserVotes(votes);
      
      // Stocker toutes les recettes pour référence
      setRecipes(allRecipes);
    }
  }, [authState.user, isUser]);
  
  // Fonction pour obtenir le nom d'une recette à partir de son ID
  const getRecipeName = (recipeId: string): string => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.name : "Recette inconnue";
  };
  
  // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
  if (!isUser()) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-morocco-terracotta text-white flex items-center justify-center text-3xl">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{authState.user?.username}</h1>
              <p className="text-gray-500 capitalize">
                {authState.user?.role === "admin" ? "Administrateur" : "Membre"}
              </p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="variants" className="mt-6">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="variants">Mes variantes ({userVariants.length})</TabsTrigger>
            <TabsTrigger value="votes">Mes votes ({userVotes.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="variants">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userVariants.length > 0 ? (
                userVariants.map(variant => (
                  <Card key={variant.id} className="moroccan-card overflow-hidden">
                    <CardContent className="p-5">
                      <Link to={`/recipes/${variant.recipeId}`} className="text-sm text-morocco-terracotta hover:underline">
                        {getRecipeName(variant.recipeId)}
                      </Link>
                      <h3 className="font-semibold text-xl mb-2 mt-1">{variant.name}</h3>
                      <p className="line-clamp-2 text-gray-700 mb-3 text-sm">
                        {variant.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          {new Date(variant.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center text-morocco-terracotta">
                          <Heart className="w-4 h-4 mr-1 fill-current" /> {variant.votes}
                        </div>
                      </div>
                      
                      <Link to={`/recipes/${variant.recipeId}`}>
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
                        >
                          Voir la recette
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore créé de variante</h3>
                  <p className="text-gray-500 mb-6">
                    Parcourez les recettes et proposez vos propres variantes pour contribuer à la communauté.
                  </p>
                  <Link to="/recipes">
                    <Button 
                      className="bg-morocco-terracotta hover:bg-morocco-ocre text-white"
                    >
                      Découvrir les recettes
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="votes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userVotes.length > 0 ? (
                userVotes.map(variant => (
                  <Card key={variant.id} className="moroccan-card overflow-hidden">
                    <CardContent className="p-5">
                      <Link to={`/recipes/${variant.recipeId}`} className="text-sm text-morocco-terracotta hover:underline">
                        {getRecipeName(variant.recipeId)}
                      </Link>
                      <h3 className="font-semibold text-xl mb-2 mt-1">{variant.name}</h3>
                      <p className="line-clamp-2 text-gray-700 mb-3 text-sm">
                        {variant.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          Créé par: {localStorageService.getUsers().find(u => u.id === variant.createdBy)?.username || "Utilisateur inconnu"}
                        </span>
                        <div className="flex items-center text-morocco-terracotta">
                          <Heart className="w-4 h-4 mr-1 fill-current" /> {variant.votes}
                        </div>
                      </div>
                      
                      <Link to={`/recipes/${variant.recipeId}`}>
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
                        >
                          Voir la recette
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore voté pour des variantes</h3>
                  <p className="text-gray-500 mb-6">
                    Soutenez la communauté en votant pour les variantes de recettes que vous appréciez.
                  </p>
                  <Link to="/recipes">
                    <Button 
                      className="bg-morocco-terracotta hover:bg-morocco-ocre text-white"
                    >
                      Explorer les recettes
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
