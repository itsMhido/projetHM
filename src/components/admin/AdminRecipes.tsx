
import React, { useState, useEffect } from "react";
import { localStorageService } from "../../services/localStorageService";
import { Recipe, Region, RecipeVariant } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminRecipes = () => {
  const { authState } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // État pour la recette en cours de modification/suppression
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  
  // État pour le formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    regionId: "",
    description: "",
    ingredients: "",
    steps: "",
    imageUrl: "",
    category: "plat",
    preparationTime: 0,
    cookingTime: 0,
    servings: 4,
    difficulty: "moyen",
  });
  
  useEffect(() => {
    // Charger les recettes et les régions
    const loadedRecipes = localStorageService.getRecipes();
    const loadedRegions = localStorageService.getRegions();
    
    setRecipes(loadedRecipes);
    setRegions(loadedRegions);
  }, []);
  
  useEffect(() => {
    // Pré-remplir le formulaire lorsqu'on modifie une recette
    if (currentRecipe && isEditDialogOpen) {
      setFormData({
        name: currentRecipe.name,
        nameAr: currentRecipe.nameAr || "",
        regionId: currentRecipe.regionId,
        description: currentRecipe.description,
        ingredients: currentRecipe.ingredients.join("\n"),
        steps: currentRecipe.steps.join("\n"),
        imageUrl: currentRecipe.imageUrl,
        category: currentRecipe.category,
        preparationTime: currentRecipe.preparationTime,
        cookingTime: currentRecipe.cookingTime,
        servings: currentRecipe.servings,
        difficulty: currentRecipe.difficulty,
      });
    }
  }, [currentRecipe, isEditDialogOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddRecipe = () => {
    try {
      if (!authState.user) return;
      
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: formData.name,
        nameAr: formData.nameAr || undefined,
        regionId: formData.regionId,
        description: formData.description,
        ingredients: formData.ingredients.split('\n').filter(item => item.trim() !== ''),
        steps: formData.steps.split('\n').filter(item => item.trim() !== ''),
        imageUrl: formData.imageUrl || "/placeholder-food.jpg",
        category: formData.category as any,
        preparationTime: Number(formData.preparationTime),
        cookingTime: Number(formData.cookingTime),
        servings: Number(formData.servings),
        difficulty: formData.difficulty as any,
        createdAt: Date.now(),
        createdBy: authState.user.id,
      };
      
      localStorageService.addRecipe(newRecipe);
      
      // Mettre à jour l'état local
      setRecipes(prev => [...prev, newRecipe]);
      
      // Réinitialiser le formulaire
      resetForm();
      
      // Fermer la boîte de dialogue
      setIsAddDialogOpen(false);
      
      toast.success("Recette ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recette:", error);
      toast.error("Une erreur est survenue lors de l'ajout de la recette.");
    }
  };
  
  const handleEditRecipe = () => {
    try {
      if (!currentRecipe || !authState.user) return;
      
      const updatedRecipe: Recipe = {
        ...currentRecipe,
        name: formData.name,
        nameAr: formData.nameAr || undefined,
        regionId: formData.regionId,
        description: formData.description,
        ingredients: formData.ingredients.split('\n').filter(item => item.trim() !== ''),
        steps: formData.steps.split('\n').filter(item => item.trim() !== ''),
        imageUrl: formData.imageUrl || "/placeholder-food.jpg",
        category: formData.category as any,
        preparationTime: Number(formData.preparationTime),
        cookingTime: Number(formData.cookingTime),
        servings: Number(formData.servings),
        difficulty: formData.difficulty as any,
      };
      
      localStorageService.updateRecipe(updatedRecipe);
      
      // Mettre à jour l'état local
      setRecipes(prev => prev.map(recipe => (recipe.id === currentRecipe.id ? updatedRecipe : recipe)));
      
      // Réinitialiser
      setCurrentRecipe(null);
      resetForm();
      
      // Fermer la boîte de dialogue
      setIsEditDialogOpen(false);
      
      toast.success("Recette mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la recette:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la recette.");
    }
  };
  
  const handleDeleteRecipe = () => {
    try {
      if (!currentRecipe) return;
      
      localStorageService.deleteRecipe(currentRecipe.id);
      
      // Mettre à jour l'état local
      setRecipes(prev => prev.filter(recipe => recipe.id !== currentRecipe.id));
      
      // Réinitialiser
      setCurrentRecipe(null);
      
      // Fermer la boîte de dialogue
      setIsDeleteDialogOpen(false);
      
      toast.success("Recette supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la recette:", error);
      toast.error("Une erreur est survenue lors de la suppression de la recette.");
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      regionId: "",
      description: "",
      ingredients: "",
      steps: "",
      imageUrl: "",
      category: "plat",
      preparationTime: 0,
      cookingTime: 0,
      servings: 4,
      difficulty: "moyen",
    });
  };
  
  // Formatter la date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des recettes</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-morocco-terracotta hover:bg-morocco-ocre">
              Ajouter une recette
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle recette</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter une nouvelle recette à la base de données.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la recette</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Nom en arabe (optionnel)</Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regionId">Région</Label>
                  <Select 
                    name="regionId" 
                    value={formData.regionId} 
                    onValueChange={(value) => handleSelectChange("regionId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    name="category" 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plat">Plat principal</SelectItem>
                      <SelectItem value="entrée">Entrée</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="boisson">Boisson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                  <Input
                    id="preparationTime"
                    name="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookingTime">Temps de cuisson (min)</Label>
                  <Input
                    id="cookingTime"
                    name="cookingTime"
                    type="number"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Nombre de portions</Label>
                  <Input
                    id="servings"
                    name="servings"
                    type="number"
                    value={formData.servings}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select 
                    name="difficulty" 
                    value={formData.difficulty} 
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facile">Facile</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="/placeholder-food.jpg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingrédients (un par ligne)</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="500g de viande d'agneau
2 oignons
3 gousses d'ail
..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="steps">Étapes de préparation (une par ligne)</Label>
                <Textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Couper la viande en morceaux.
Faire revenir les oignons.
..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-morocco-terracotta hover:bg-morocco-ocre" onClick={handleAddRecipe}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table className="w-full">
          <TableCaption>Liste des recettes ({recipes.length})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Créée le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map(recipe => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">{recipe.name}</TableCell>
                <TableCell>
                  {regions.find(region => region.id === recipe.regionId)?.name || "Inconnu"}
                </TableCell>
                <TableCell className="capitalize">{recipe.category}</TableCell>
                <TableCell>{formatDate(recipe.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {/* Modifier */}
                  <Dialog open={isEditDialogOpen && currentRecipe?.id === recipe.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setCurrentRecipe(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-morocco-terracotta border-morocco-ocre hover:bg-morocco-terracotta hover:text-white"
                        onClick={() => {
                          setCurrentRecipe(recipe);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Modifier la recette</DialogTitle>
                        <DialogDescription>
                          Modifiez les informations de la recette.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nom de la recette</Label>
                            <Input
                              id="edit-name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-nameAr">Nom en arabe (optionnel)</Label>
                            <Input
                              id="edit-nameAr"
                              name="nameAr"
                              value={formData.nameAr}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-regionId">Région</Label>
                            <Select 
                              name="regionId" 
                              value={formData.regionId} 
                              onValueChange={(value) => handleSelectChange("regionId", value)}
                            >
                              <SelectTrigger id="edit-regionId">
                                <SelectValue placeholder="Sélectionner une région" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map(region => (
                                  <SelectItem key={region.id} value={region.id}>
                                    {region.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Catégorie</Label>
                            <Select 
                              name="category" 
                              value={formData.category} 
                              onValueChange={(value) => handleSelectChange("category", value)}
                            >
                              <SelectTrigger id="edit-category">
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="plat">Plat principal</SelectItem>
                                <SelectItem value="entrée">Entrée</SelectItem>
                                <SelectItem value="dessert">Dessert</SelectItem>
                                <SelectItem value="boisson">Boisson</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Reste du formulaire identique à celui d'ajout */}
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-preparationTime">Temps de préparation (min)</Label>
                            <Input
                              id="edit-preparationTime"
                              name="preparationTime"
                              type="number"
                              value={formData.preparationTime}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-cookingTime">Temps de cuisson (min)</Label>
                            <Input
                              id="edit-cookingTime"
                              name="cookingTime"
                              type="number"
                              value={formData.cookingTime}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-servings">Nombre de portions</Label>
                            <Input
                              id="edit-servings"
                              name="servings"
                              type="number"
                              value={formData.servings}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-difficulty">Difficulté</Label>
                            <Select 
                              name="difficulty" 
                              value={formData.difficulty} 
                              onValueChange={(value) => handleSelectChange("difficulty", value)}
                            >
                              <SelectTrigger id="edit-difficulty">
                                <SelectValue placeholder="Sélectionner une difficulté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facile">Facile</SelectItem>
                                <SelectItem value="moyen">Moyen</SelectItem>
                                <SelectItem value="difficile">Difficile</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-imageUrl">URL de l'image</Label>
                            <Input
                              id="edit-imageUrl"
                              name="imageUrl"
                              value={formData.imageUrl}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-ingredients">Ingrédients (un par ligne)</Label>
                          <Textarea
                            id="edit-ingredients"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleInputChange}
                            required
                            rows={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-steps">Étapes de préparation (une par ligne)</Label>
                          <Textarea
                            id="edit-steps"
                            name="steps"
                            value={formData.steps}
                            onChange={handleInputChange}
                            required
                            rows={5}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button className="bg-morocco-terracotta hover:bg-morocco-ocre" onClick={handleEditRecipe}>
                          Mettre à jour
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Supprimer */}
                  <Dialog open={isDeleteDialogOpen && currentRecipe?.id === recipe.id} onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) setCurrentRecipe(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setCurrentRecipe(recipe);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Supprimer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer la recette "{recipe.name}" ? Cette action est irréversible et supprimera également toutes les variantes associées.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteRecipe}>
                          Supprimer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            
            {recipes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Aucune recette trouvée. Commencez par en ajouter une.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminRecipes;
