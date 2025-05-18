
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background zellige-bg">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <Card className="shadow-lg border-morocco-ocre border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-morocco-terracotta">Connexion</CardTitle>
            <CardDescription>
              Accédez à votre compte pour contribuer au patrimoine culinaire marocain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                  className="border-morocco-ocre focus:ring-morocco-safran"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  className="border-morocco-ocre focus:ring-morocco-safran"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-morocco-terracotta hover:bg-morocco-ocre"
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center">
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="text-morocco-terracotta hover:text-morocco-ocre font-medium">
                Créer un compte
              </Link>
            </p>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Comptes de test : admin/admin123 ou user/user123
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
