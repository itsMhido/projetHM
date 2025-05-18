
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AdminRecipes from "../components/admin/AdminRecipes";
import AdminUsers from "../components/admin/AdminUsers";

const Admin = () => {
  const { isAdmin } = useAuth();
  
  // Si l'utilisateur n'est pas administrateur, le rediriger vers la page d'accueil
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-morocco-dark">Administration</h1>
        <p className="text-gray-600">
          Gérez les recettes, les utilisateurs et le contenu du site.
        </p>
      </div>
      
      <Tabs defaultValue="recipes" className="mt-6">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="recipes">Recettes</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipes">
          <AdminRecipes />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
