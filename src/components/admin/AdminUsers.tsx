
import React, { useState, useEffect } from "react";
import { localStorageService } from "../../services/localStorageService";
import { User } from "../../types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // État pour l'utilisateur en cours de modification/suppression
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // État pour le formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  
  useEffect(() => {
    // Charger les utilisateurs
    const loadedUsers = localStorageService.getUsers();
    setUsers(loadedUsers);
  }, []);
  
  useEffect(() => {
    // Pré-remplir le formulaire lorsqu'on modifie un utilisateur
    if (currentUser && isEditDialogOpen) {
      setFormData({
        username: currentUser.username,
        password: "", // Ne pas afficher le mot de passe existant pour des raisons de sécurité
        role: currentUser.role,
      });
    }
  }, [currentUser, isEditDialogOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddUser = () => {
    try {
      // Vérifier si un utilisateur avec le même nom existe déjà
      const userExists = users.some(user => user.username === formData.username);
      
      if (userExists) {
        toast.error("Un utilisateur avec ce nom existe déjà.");
        return;
      }
      
      if (formData.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password,
        role: formData.role as "user" | "admin",
      };
      
      localStorageService.addUser(newUser);
      
      // Mettre à jour l'état local
      setUsers(prev => [...prev, newUser]);
      
      // Réinitialiser le formulaire
      resetForm();
      
      // Fermer la boîte de dialogue
      setIsAddDialogOpen(false);
      
      toast.success("Utilisateur ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de l'ajout de l'utilisateur.");
    }
  };
  
  const handleEditUser = () => {
    try {
      if (!currentUser) return;
      
      // Vérifier si un autre utilisateur a le même nom
      const userExists = users.some(user => user.username === formData.username && user.id !== currentUser.id);
      
      if (userExists) {
        toast.error("Un utilisateur avec ce nom existe déjà.");
        return;
      }
      
      if (formData.password && formData.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      
      const updatedUser: User = {
        ...currentUser,
        username: formData.username,
        role: formData.role as "user" | "admin",
      };
      
      // Ne mettre à jour le mot de passe que s'il a été modifié
      if (formData.password) {
        updatedUser.password = formData.password;
      }
      
      // Mettre à jour l'utilisateur dans le localStorage
      const allUsers = localStorageService.getUsers().map(user => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorageService.setUsers(allUsers);
      
      // Mettre à jour l'état local
      setUsers(allUsers);
      
      // Réinitialiser
      setCurrentUser(null);
      resetForm();
      
      // Fermer la boîte de dialogue
      setIsEditDialogOpen(false);
      
      toast.success("Utilisateur mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
    }
  };
  
  const handleDeleteUser = () => {
    try {
      if (!currentUser) return;
      
      // Ne pas permettre la suppression du dernier administrateur
      const admins = users.filter(user => user.role === "admin");
      if (admins.length === 1 && currentUser.role === "admin") {
        toast.error("Impossible de supprimer le dernier administrateur.");
        setIsDeleteDialogOpen(false);
        return;
      }
      
      // Filtrer l'utilisateur à supprimer
      const updatedUsers = users.filter(user => user.id !== currentUser.id);
      localStorageService.setUsers(updatedUsers);
      
      // Mettre à jour l'état local
      setUsers(updatedUsers);
      
      // Réinitialiser
      setCurrentUser(null);
      
      // Fermer la boîte de dialogue
      setIsDeleteDialogOpen(false);
      
      toast.success("Utilisateur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  };
  
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "user",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-morocco-terracotta hover:bg-morocco-ocre">
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter un nouvel utilisateur.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 6 caractères.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select 
                  name="role" 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-morocco-terracotta hover:bg-morocco-ocre" onClick={handleAddUser}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table className="w-full">
          <TableCaption>Liste des utilisateurs ({users.length})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell className="text-right space-x-2">
                  {/* Modifier */}
                  <Dialog open={isEditDialogOpen && currentUser?.id === user.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setCurrentUser(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-morocco-terracotta border-morocco-ocre hover:bg-morocco-terracotta hover:text-white"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Modifier l'utilisateur</DialogTitle>
                        <DialogDescription>
                          Modifiez les informations de l'utilisateur.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-username">Nom d'utilisateur</Label>
                          <Input
                            id="edit-username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-password">
                            Mot de passe (laisser vide pour ne pas changer)
                          </Label>
                          <Input
                            id="edit-password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <p className="text-xs text-gray-500">
                            Si renseigné, le mot de passe doit contenir au moins 6 caractères.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-role">Rôle</Label>
                          <Select 
                            name="role" 
                            value={formData.role} 
                            onValueChange={(value) => handleSelectChange("role", value)}
                          >
                            <SelectTrigger id="edit-role">
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button className="bg-morocco-terracotta hover:bg-morocco-ocre" onClick={handleEditUser}>
                          Mettre à jour
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Supprimer */}
                  <Dialog open={isDeleteDialogOpen && currentUser?.id === user.id} onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) setCurrentUser(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setCurrentUser(user);
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
                          Êtes-vous sûr de vouloir supprimer l'utilisateur "{user.username}" ? Cette action est irréversible.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                          Supprimer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
