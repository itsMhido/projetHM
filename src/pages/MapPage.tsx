
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { Region, Recipe } from "../types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour l'icone de Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const regions = localStorageService.getRegions();
  const recipes = localStorageService.getRecipes();
  const [selectedRegion, setSelectedRegion] = React.useState<Region | null>(null);
  const [regionRecipes, setRegionRecipes] = React.useState<Recipe[]>([]);

  // Lorsqu'une région est sélectionnée, charger ses recettes
  useEffect(() => {
    if (selectedRegion) {
      const filteredRecipes = recipes.filter((recipe) => recipe.regionId === selectedRegion.id);
      setRegionRecipes(filteredRecipes);
    } else {
      setRegionRecipes([]);
    }
  }, [selectedRegion, recipes]);

  // Centrer la carte sur le Maroc
  const MapCenterer = () => {
    const map = useMap();
    React.useEffect(() => {
      map.setView([31.7917, -7.0926], 5);
    }, [map]);
    return null;
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-morocco-dark text-center">Carte Culinaire du Maroc</h1>
      <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        Explorez les 12 régions administratives du Maroc et découvrez leurs spécialités culinaires.
        Cliquez sur une région pour voir ses recettes traditionnelles.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[60vh] border-2 border-morocco-ocre rounded-lg overflow-hidden shadow-lg">
          <MapContainer 
            center={[31.7917, -7.0926]} 
            zoom={5} 
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapCenterer />
            
            {regions.map((region) => (
              <Marker 
                key={region.id} 
                position={region.coordinates} 
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedRegion(region);
                  },
                }}
              >
                <Tooltip permanent direction="top" offset={[0, -20]}>
                  {region.name}
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="h-[60vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg border border-morocco-ocre">
          {selectedRegion ? (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-morocco-terracotta">{selectedRegion.name}</h2>
              {selectedRegion.nameAr && (
                <p className="text-lg mb-4 text-morocco-dark">{selectedRegion.nameAr}</p>
              )}
              <p className="text-gray-700 mb-6">{selectedRegion.description}</p>

              <h3 className="text-xl font-semibold mb-4 text-morocco-dark">
                Recettes traditionnelles ({regionRecipes.length})
              </h3>

              {regionRecipes.length > 0 ? (
                <div className="space-y-4">
                  {regionRecipes.map((recipe) => (
                    <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-medium">{recipe.name}</CardTitle>
                        <CardDescription className="line-clamp-2 my-2">
                          {recipe.description}
                        </CardDescription>
                        <Link to={`/recipes/${recipe.id}`}>
                          <Button 
                            variant="outline" 
                            className="w-full mt-2 border-morocco-ocre text-morocco-terracotta hover:bg-morocco-terracotta hover:text-white"
                          >
                            Voir la recette
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Aucune recette disponible pour cette région pour le moment.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-morocco-terracotta/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-morocco-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-morocco-dark">Sélectionnez une région</h3>
              <p className="text-gray-600">
                Cliquez sur un marqueur de la carte pour découvrir les recettes traditionnelles de cette région.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
