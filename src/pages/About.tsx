
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-morocco-dark text-center">À propos de CuisineMaghreb</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="lead text-xl text-gray-700 mb-8">
            CuisineMaghreb est une application web dédiée à la documentation et à la valorisation du patrimoine culinaire immatériel du Maroc.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-morocco-terracotta mb-4">Notre mission</h2>
            <p className="mb-4">
              Notre mission est de préserver et de transmettre les savoirs culinaires traditionnels du Maroc aux générations futures. À travers cette plateforme collaborative, nous visons à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Documenter les recettes traditionnelles des 12 régions du Maroc</li>
              <li>Valoriser la diversité culinaire et les spécificités régionales</li>
              <li>Créer une communauté d'échange autour du patrimoine culinaire marocain</li>
              <li>Assurer la transmission des savoir-faire culinaires</li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold text-morocco-dark mb-4">Le patrimoine culinaire marocain</h2>
          <p className="mb-4">
            La cuisine marocaine est reconnue comme l'une des plus riches et des plus diversifiées au monde. Influencée par les cultures berbère, arabe, andalouse, méditerranéenne et subsaharienne, elle s'est développée au fil des siècles pour devenir un véritable art culinaire.
          </p>
          <p className="mb-6">
            Chaque région du Maroc possède ses spécialités, ses techniques de cuisson et ses associations d'épices qui reflètent son histoire, sa géographie et ses traditions. De la pastilla de Fès aux poissons grillés d'Essaouira, en passant par les tajines de Marrakech, la cuisine marocaine est un véritable patrimoine immatériel.
          </p>
          
          <div className="bg-morocco-terracotta/10 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-morocco-terracotta mb-4">Comment contribuer</h2>
            <p className="mb-4">
              Notre plateforme est collaborative et repose sur la contribution de ses membres pour s'enrichir et évoluer :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Créez un compte pour devenir membre de la communauté</li>
              <li>Proposez des variantes aux recettes existantes</li>
              <li>Votez pour vos variantes préférées</li>
              <li>Partagez vos connaissances et vos astuces</li>
            </ul>
            <div className="text-center">
              <Link to="/register">
                <Button className="bg-morocco-terracotta hover:bg-morocco-ocre text-white">
                  Rejoindre la communauté
                </Button>
              </Link>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-morocco-dark mb-4">Technologie</h2>
          <p className="mb-6">
            Cette application a été développée avec React.js et utilise le stockage local (localStorage) pour gérer les données. Elle est conçue pour être responsive et accessible sur tous les appareils.
          </p>
          
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 mb-2">
              © {new Date().getFullYear()} CuisineMaghreb - Tous droits réservés
            </p>
            <p className="text-sm text-gray-500">
              Développé pour la valorisation du patrimoine culinaire immatériel du Maroc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
