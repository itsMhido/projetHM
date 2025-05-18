
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { Recipe, RecipeVariant, Region } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [variants, setVariants] = useState<RecipeVariant[]>([]);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // État pour le formulaire de variante
  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");
  const [variantIngredients, setVariantIngredients] = useState("");
  const [variantSteps, setVariantSteps] = useState("");
  
  const { authState, isUser } = useAuth();
  
  useEffect(() => {
    if (id) {
      // Récupérer la recette
      const loadedRecipe = localStorageService.getRecipes().find(r => r.id === id);
      if (loadedRecipe) {
        setRecipe(loadedRecipe);
        
        // Récupérer la région
        const recipeRegion = localStorageService.getRegions().find(r => r.id === loadedRecipe.regionId);
        if (recipeRegion) {
          setRegion(recipeRegion);
        }
        
        // Récupérer les variantes
        const recipeVariants = localStorageService.getRecipeVariants().filter(v => v.recipeId === id);
        setVariants(recipeVariants);
      }
    }
  }, [id]);
  
  const handleVote = (variantId: string) => {
    if (!isUser()) {
      toast.error("Vous devez être connecté pour voter.");
      return;
    }
    
    setIsSubmittingVote(true);
    
    try {
      const currentVariants = localStorageService.getRecipeVariants();
      const variantToUpdate = currentVariants.find(v => v.id === variantId);
      
      if (variantToUpdate && authState.user) {
        const userId = authState.user.id;
        
        // Vérifier si l'utilisateur a déjà voté
        if (variantToUpdate.voterIds.includes(userId)) {
          // Retirer le vote
          variantToUpdate.votes -= 1;
          variantToUpdate.voterIds = variantToUpdate.voterIds.filter(id => id !== userId);
          toast.info("Vote retiré.");
        } else {
          // Ajouter le vote
          variantToUpdate.votes += 1;
          variantToUpdate.voterIds.push(userId);
          toast.success("Vote ajouté !");
        }
        
        localStorageService.updateRecipeVariant(variantToUpdate);
        
        // Mettre à jour l'état local
        setVariants(prevVariants =>
          prevVariants.map(v => (v.id === variantId ? variantToUpdate : v))
        );
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast.error("Une erreur est survenue lors du vote.");
    } finally {
      setIsSubmittingVote(false);
    }
  };
  
  const handleSubmitVariant = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUser()) {
      toast.error("Vous devez être connecté pour proposer une variante.");
      return;
    }
    
    if (!recipe || !authState.user) return;
    
    try {
      const newVariant: RecipeVariant = {
        id: Date.now().toString(),
        recipeId: recipe.id,
        name: variantName,
        description: variantDescription,
        ingredients: variantIngredients.split('\n').filter(item => item.trim() !== ''),
        steps: variantSteps.split('\n').filter(item => item.trim() !== ''),
        imageUrl: recipe.imageUrl, // Utiliser la même image que la recette originale
        createdAt: Date.now(),
        createdBy: authState.user.id,
        votes: 0,
        voterIds: [],
      };
      
      localStorageService.addRecipeVariant(newVariant);
      
      // Mettre à jour l'état local
      setVariants(prevVariants => [...prevVariants, newVariant]);
      
      // Réinitialiser le formulaire
      setVariantName("");
      setVariantDescription("");
      setVariantIngredients("");
      setVariantSteps("");
      
      // Fermer la boîte de dialogue
      setIsDialogOpen(false);
      
      toast.success("Votre variante a été ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la variante:", error);
      toast.error("Une erreur est survenue lors de l'ajout de la variante.");
    }
  };
  
  // Vérifie si l'utilisateur a déjà voté pour une variante
  const hasVoted = (variant: RecipeVariant): boolean => {
    if (!authState.user) return false;
    return variant.voterIds.includes(authState.user.id);
  };
  
  if (!recipe || !region) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-morocco-terracotta mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de la recette...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link to="/" className="hover:text-morocco-terracotta">Accueil</Link>
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mx-1 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <Link to="/recipes" className="hover:text-morocco-terracotta">Recettes</Link>
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mx-1 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="font-medium text-morocco-terracotta">{recipe.name}</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Informations principales */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-80 overflow-hidden">
              <img
                src={recipe.imageUrl || "/placeholder-food.jpg"}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-morocco-dark">{recipe.name}</h1>
                  {recipe.nameAr && (
                    <h2 className="text-xl text-gray-600 mb-4">{recipe.nameAr}</h2>
                  )}
                </div>
                <Link 
                  to={`/map?region=${recipe.regionId}`}
                  className="text-sm bg-morocco-light text-morocco-terracotta px-3 py-1 rounded-full hover:bg-morocco-terracotta hover:text-white transition"
                >
                  {region.name}
                </Link>
              </div>
              
              <p className="my-4 text-gray-700">{recipe.description}</p>
              
              <div className="flex items-center space-x-8 text-sm text-gray-500 border-t border-b border-gray-200 py-4 my-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-morocco-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Temps de préparation</p>
                    <p>{recipe.preparationTime} min</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-morocco-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Temps de cuisson</p>
                    <p>{recipe.cookingTime} min</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-morocco-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Nombre de portions</p>
                    <p>{recipe.servings} personnes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-morocco-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Difficulté</p>
                    <p className="capitalize">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="ingredients" className="mt-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
                  <TabsTrigger value="preparation">Préparation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ingredients" className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="preparation" className="mt-4">
                  <ol className="list-decimal pl-6 space-y-4">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Variantes et actions */}
        <div className="lg:col-span-2">
          {/* Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Actions</CardTitle>
              <CardDescription>Interagissez avec cette recette</CardDescription>
            </CardHeader>
            <CardContent>
              {isUser() ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                      Proposer une variante
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Proposer une variante de recette</DialogTitle>
                      <DialogDescription>
                        Partagez votre version personnelle de {recipe.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitVariant} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="variantName">Nom de votre variante</Label>
                        <Input
                          id="variantName"
                          value={variantName}
                          onChange={(e) => setVariantName(e.target.value)}
                          placeholder={`${recipe.name} à ma façon`}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="variantDescription">Description</Label>
                        <Textarea
                          id="variantDescription"
                          value={variantDescription}
                          onChange={(e) => setVariantDescription(e.target.value)}
                          placeholder="Décrivez en quoi votre variante est différente de la recette originale"
                          required
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="variantIngredients">
                          Ingrédients (un par ligne)
                        </Label>
                        <Textarea
                          id="variantIngredients"
                          value={variantIngredients}
                          onChange={(e) => setVariantIngredients(e.target.value)}
                          placeholder="500g de viande d'agneau
2 oignons
3 gousses d'ail
..."
                          required
                          rows={5}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="variantSteps">
                          Étapes de préparation (une par ligne)
                        </Label>
                        <Textarea
                          id="variantSteps"
                          value={variantSteps}
                          onChange={(e) => setVariantSteps(e.target.value)}
                          placeholder="Couper la viande en morceaux.
Faire revenir les oignons.
..."
                          required
                          rows={5}
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit" className="bg-morocco-terracotta hover:bg-morocco-ocre">
                          Soumettre ma variante
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div>
                  <Button 
                    className="w-full bg-gray-300 text-gray-700 cursor-not-allowed"
                    disabled
                  >
                    Connectez-vous pour proposer une variante
                  </Button>
                  <p className="text-sm text-center mt-2 text-gray-500">
                    <Link to="/login" className="text-morocco-terracotta hover:underline">
                      Se connecter
                    </Link>
                    {" ou "}
                    <Link to="/register" className="text-morocco-terracotta hover:underline">
                      s'inscrire
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Variantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Variantes proposées ({variants.length})</CardTitle>
              <CardDescription>
                Découvrez les différentes versions de cette recette
              </CardDescription>
            </CardHeader>
            <CardContent>
              {variants.length > 0 ? (
                <div className="space-y-6">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{variant.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(variant.id)}
                          disabled={isSubmittingVote || !isUser()}
                          className={`flex items-center ${hasVoted(variant) ? 'text-morocco-terracotta' : 'text-gray-500'}`}
                        >
                          {hasVoted(variant) ? (
                            <Heart className="w-4 h-4 mr-1 fill-current" />
                          ) : (
                            <Heart className="w-4 h-4 mr-1" />
                          )}
                          <span>{variant.votes}</span>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{variant.description}</p>
                      
                      <Tabs defaultValue="ingredients" className="mt-4">
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
                          <TabsTrigger value="preparation">Préparation</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ingredients" className="mt-4">
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            {variant.ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                        </TabsContent>
                        
                        <TabsContent value="preparation" className="mt-4">
                          <ol className="list-decimal pl-6 space-y-2 text-sm">
                            {variant.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="text-xs text-gray-500 mt-4 flex items-center justify-between">
                        <div>
                          Proposé par: {localStorageService.getUsers().find(u => u.id === variant.createdBy)?.username || "Utilisateur inconnu"}
                        </div>
                        <div>
                          {new Date(variant.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {index < variants.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-morocco-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-morocco-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Aucune variante pour le moment</h3>
                  <p className="text-gray-600 mb-4">
                    Soyez le premier à proposer une variante pour cette recette.
                  </p>
                  {isUser() && (
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-morocco-terracotta hover:bg-morocco-ocre text-white"
                    >
                      Proposer une variante
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
