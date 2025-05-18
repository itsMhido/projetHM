
import { User, Recipe, RecipeVariant, Region, AuthState } from '../types';

// Clés pour LocalStorage
const STORAGE_KEYS = {
  USERS: 'moroccan-cuisine-app_users',
  RECIPES: 'moroccan-cuisine-app_recipes',
  RECIPE_VARIANTS: 'moroccan-cuisine-app_recipe-variants',
  REGIONS: 'moroccan-cuisine-app_regions',
  AUTH: 'moroccan-cuisine-app_auth',
};

// Service pour manipuler le LocalStorage avec typage
export const localStorageService = {
  // Utilisateurs
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },
  
  setUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  addUser: (user: User): void => {
    const users = localStorageService.getUsers();
    localStorageService.setUsers([...users, user]);
  },
  
  // Recettes
  getRecipes: (): Recipe[] => {
    const recipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
    return recipes ? JSON.parse(recipes) : [];
  },
  
  setRecipes: (recipes: Recipe[]): void => {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  },
  
  addRecipe: (recipe: Recipe): void => {
    const recipes = localStorageService.getRecipes();
    localStorageService.setRecipes([...recipes, recipe]);
  },
  
  updateRecipe: (updatedRecipe: Recipe): void => {
    const recipes = localStorageService.getRecipes();
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    localStorageService.setRecipes(updatedRecipes);
  },
  
  deleteRecipe: (recipeId: string): void => {
    const recipes = localStorageService.getRecipes();
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    localStorageService.setRecipes(updatedRecipes);
    
    // Delete variants for this recipe
    const variants = localStorageService.getRecipeVariants();
    const updatedVariants = variants.filter((variant) => variant.recipeId !== recipeId);
    localStorageService.setRecipeVariants(updatedVariants);
  },
  
  // Variantes de recettes
  getRecipeVariants: (): RecipeVariant[] => {
    const variants = localStorage.getItem(STORAGE_KEYS.RECIPE_VARIANTS);
    return variants ? JSON.parse(variants) : [];
  },
  
  setRecipeVariants: (variants: RecipeVariant[]): void => {
    localStorage.setItem(STORAGE_KEYS.RECIPE_VARIANTS, JSON.stringify(variants));
  },
  
  addRecipeVariant: (variant: RecipeVariant): void => {
    const variants = localStorageService.getRecipeVariants();
    localStorageService.setRecipeVariants([...variants, variant]);
  },
  
  updateRecipeVariant: (updatedVariant: RecipeVariant): void => {
    const variants = localStorageService.getRecipeVariants();
    const updatedVariants = variants.map((variant) =>
      variant.id === updatedVariant.id ? updatedVariant : variant
    );
    localStorageService.setRecipeVariants(updatedVariants);
  },
  
  deleteRecipeVariant: (variantId: string): void => {
    const variants = localStorageService.getRecipeVariants();
    const updatedVariants = variants.filter((variant) => variant.id !== variantId);
    localStorageService.setRecipeVariants(updatedVariants);
  },
  
  // Régions
  getRegions: (): Region[] => {
    const regions = localStorage.getItem(STORAGE_KEYS.REGIONS);
    return regions ? JSON.parse(regions) : [];
  },
  
  setRegions: (regions: Region[]): void => {
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  },
  
  // Authentification
  getAuth: (): AuthState => {
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
    return auth ? JSON.parse(auth) : { user: null, isAuthenticated: false };
  },
  
  setAuth: (authState: AuthState): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
  },
  
  // Initialisation avec des données de test
  initializeAppData: (): void => {
    // Ne pas réinitialiser si les données existent déjà
    if (localStorage.getItem(STORAGE_KEYS.REGIONS)) return;
    
    // Utilisateurs initiaux
    const initialUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123', // En production, il faudrait hasher les mots de passe
        role: 'admin',
      },
      {
        id: '2',
        username: 'user',
        password: 'user123',
        role: 'user',
      },
    ];
    localStorageService.setUsers(initialUsers);
    
    // Régions du Maroc
    const initialRegions: Region[] = [
      {
        id: '1',
        name: 'Tanger-Tétouan-Al Hoceïma',
        nameAr: 'طنجة - تطوان - الحسيمة',
        description: 'Région du nord du Maroc, connue pour sa cuisine méditerranéenne et ses saveurs de poisson.',
        coordinates: [35.7595, -5.8340],
      },
      {
        id: '2',
        name: 'L\'Oriental',
        nameAr: 'الشرق',
        description: 'Région à l\'est du pays, avec une cuisine influencée par l\'Algérie voisine.',
        coordinates: [34.6830, -1.9126],
      },
      {
        id: '3',
        name: 'Fès-Meknès',
        nameAr: 'فاس - مكناس',
        description: 'Cœur historique de la cuisine marocaine, Fès est considérée comme la capitale culinaire du Maroc.',
        coordinates: [34.0372, -5.0004],
      },
      {
        id: '4',
        name: 'Rabat-Salé-Kénitra',
        nameAr: 'الرباط - سلا - القنيطرة',
        description: 'La région de la capitale, mêlant traditions culinaires royales et influences côtières.',
        coordinates: [34.0209, -6.8416],
      },
      {
        id: '5',
        name: 'Béni Mellal-Khénifra',
        nameAr: 'بني ملال - خنيفرة',
        description: 'Région du Moyen Atlas, célèbre pour ses plats berbères.',
        coordinates: [32.3366, -6.3497],
      },
      {
        id: '6',
        name: 'Casablanca-Settat',
        nameAr: 'الدار البيضاء - سطات',
        description: 'Région économique principale, avec une cuisine moderne et diversifiée.',
        coordinates: [33.5731, -7.5898],
      },
      {
        id: '7',
        name: 'Marrakech-Safi',
        nameAr: 'مراكش - آسفي',
        description: 'Célèbre pour le tajine et les plats aux épices vibrantes.',
        coordinates: [31.6295, -7.9811],
      },
      {
        id: '8',
        name: 'Drâa-Tafilalet',
        nameAr: 'درعة - تافيلالت',
        description: 'Région des oasis, connue pour ses dattes et sa cuisine berbère du sud.',
        coordinates: [31.9302, -4.4283],
      },
      {
        id: '9',
        name: 'Souss-Massa',
        nameAr: 'سوس - ماسة',
        description: 'Région d\'Agadir, célèbre pour ses fruits et son huile d\'argan.',
        coordinates: [30.4278, -9.5981],
      },
      {
        id: '10',
        name: 'Guelmim-Oued Noun',
        nameAr: 'كلميم - واد نون',
        description: 'Porte du Sahara, mêlant influences du nord et du désert.',
        coordinates: [28.9870, -10.0574],
      },
      {
        id: '11',
        name: 'Laâyoune-Sakia El Hamra',
        nameAr: 'العيون - الساقية الحمراء',
        description: 'Cuisine saharienne avec forte influence de la culture hassanie.',
        coordinates: [27.1536, -13.2035],
      },
      {
        id: '12',
        name: 'Dakhla-Oued Ed-Dahab',
        nameAr: 'الداخلة - وادي الذهب',
        description: 'Région la plus au sud, connue pour ses fruits de mer et ses influences sahariennes.',
        coordinates: [23.7141, -15.9369],
      },
    ];
    localStorageService.setRegions(initialRegions);
    
    // Recettes initiales
    const initialRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Tajine de poulet aux olives et citrons confits',
        nameAr: 'طاجين الدجاج بالزيتون والليمون المخلل',
        regionId: '7', // Marrakech-Safi
        description: 'Un classique de la cuisine marocaine, ce tajine combine la tendreté du poulet avec l\'acidité des citrons confits et la saveur des olives.',
        ingredients: [
          '1 poulet coupé en morceaux',
          '2 oignons émincés',
          '3 gousses d\'ail écrasées',
          '2 citrons confits coupés en quartiers',
          '200g d\'olives vertes dénoyautées',
          '1 cuillère à café de gingembre moulu',
          '1 cuillère à café de curcuma',
          '1 cuillère à café de paprika',
          '1/2 cuillère à café de safran',
          '1 bouquet de persil et coriandre',
          '3 cuillères à soupe d\'huile d\'olive',
          'Sel et poivre',
        ],
        steps: [
          'Dans un tajine ou une cocotte, faire chauffer l\'huile d\'olive.',
          'Faire dorer les morceaux de poulet de tous les côtés.',
          'Ajouter les oignons émincés et l\'ail, faire revenir jusqu\'à ce qu\'ils soient translucides.',
          'Ajouter toutes les épices, sel et poivre, bien mélanger.',
          'Verser de l\'eau à hauteur, couvrir et laisser mijoter à feu doux pendant 45 minutes.',
          'Ajouter les citrons confits et les olives, poursuivre la cuisson 15 minutes.',
          'Parsemer de persil et coriandre ciselés avant de servir.',
        ],
        imageUrl: '/tajine-poulet.jpg',
        category: 'plat',
        preparationTime: 20,
        cookingTime: 60,
        servings: 4,
        difficulty: 'moyen',
        createdAt: 1651234567890,
        createdBy: '1',
      },
      {
        id: '2',
        name: 'Couscous aux sept légumes',
        nameAr: 'كسكس بسبع خضروات',
        regionId: '6', // Casablanca-Settat
        description: 'Le couscous, plat emblématique du vendredi, est préparé avec une variété de légumes de saison et servi avec de la viande ou du poulet.',
        ingredients: [
          '500g de semoule de couscous moyenne',
          '500g d\'épaule d\'agneau coupée en morceaux',
          '2 oignons',
          '3 tomates',
          '3 carottes',
          '2 navets',
          '2 courgettes',
          '1 branche de céleri',
          '200g de potiron',
          '250g de pois chiches trempés la veille',
          '1 cuillère à café de ras el hanout',
          '1 cuillère à café de curcuma',
          '1 pincée de safran',
          'Huile d\'olive',
          'Sel et poivre',
          'Bouquet garni (persil et coriandre)',
        ],
        steps: [
          'Préparer la semoule selon les instructions du paquet, en l\'humidifiant et en la travaillant plusieurs fois.',
          'Dans une couscoussière, faire revenir la viande avec les oignons hachés et les épices.',
          'Ajouter les pois chiches et couvrir d\'eau, laisser cuire 1 heure.',
          'Ajouter les légumes coupés en gros morceaux et cuire encore 30 minutes.',
          'Pendant ce temps, cuire la semoule à la vapeur 3 fois en la travaillant entre chaque cuisson.',
          'Servir la semoule arrosée d\'un peu de bouillon, avec les légumes et la viande disposés par-dessus.',
        ],
        imageUrl: '/couscous.jpg',
        category: 'plat',
        preparationTime: 30,
        cookingTime: 120,
        servings: 6,
        difficulty: 'difficile',
        createdAt: 1651234567890,
        createdBy: '1',
      },
      {
        id: '3',
        name: 'Pastilla au Poulet et Amandes',
        nameAr: 'بسطيلة بالدجاج واللوز',
        regionId: '3', // Fès-Meknès
        description: 'La pastilla est un plat festif d\'origine andalouse, mêlant sucré et salé. Cette version au poulet et amandes est typique de Fès.',
        ingredients: [
          '500g de blanc de poulet',
          '1 oignon haché',
          '3 œufs',
          '100g d\'amandes effilées',
          '1 bouquet de persil et coriandre',
          '1 cuillère à café de gingembre moulu',
          '1 cuillère à café de cannelle',
          '1 pincée de safran',
          '8 feuilles de brick ou pâte filo',
          '50g de beurre fondu',
          '2 cuillères à soupe de sucre glace',
          '1 cuillère à café de cannelle pour saupoudrer',
          'Sel et poivre',
        ],
        steps: [
          'Faire cuire le poulet avec l\'oignon et les épices dans un peu d\'eau pendant 30 minutes.',
          'Effilocher le poulet et réserver le bouillon.',
          'Faire torréfier les amandes à sec dans une poêle puis réserver.',
          'Dans le bouillon, faire cuire les œufs en remuant pour obtenir une texture brouillée.',
          'Mélanger le poulet effiloché, les œufs et les herbes hachées.',
          'Beurrer un moule rond et disposer les feuilles de brick en alternant.',
          'Déposer la farce au poulet, replier les bords des feuilles.',
          'Badigeonner de beurre fondu et enfourner à 180°C pendant 20 minutes.',
          'Saupoudrer de sucre glace et cannelle avant de servir.',
        ],
        imageUrl: '/pastilla.jpg',
        category: 'entrée',
        preparationTime: 40,
        cookingTime: 50,
        servings: 6,
        difficulty: 'difficile',
        createdAt: 1651234567890,
        createdBy: '1',
      },
    ];
    localStorageService.setRecipes(initialRecipes);
    
    // Variantes de recettes initiales
    const initialVariants: RecipeVariant[] = [
      {
        id: '1',
        recipeId: '1',
        name: 'Tajine de poulet aux abricots',
        description: 'Une version sucrée-salée du tajine de poulet, avec des abricots secs à la place des citrons confits.',
        ingredients: [
          '1 poulet coupé en morceaux',
          '2 oignons émincés',
          '3 gousses d\'ail écrasées',
          '200g d\'abricots secs',
          '100g de pruneaux',
          '50g d\'amandes effilées',
          '1 cuillère à café de cannelle',
          '1 cuillère à café de gingembre moulu',
          '1 cuillère à café de miel',
          '3 cuillères à soupe d\'huile d\'olive',
          'Sel et poivre',
        ],
        steps: [
          'Dans un tajine, faire dorer le poulet dans l\'huile d\'olive.',
          'Ajouter les oignons et l\'ail, faire revenir.',
          'Incorporer les épices, sel et poivre.',
          'Mouiller avec de l\'eau et laisser mijoter 30 minutes.',
          'Ajouter les fruits secs et le miel, poursuivre la cuisson 15 minutes.',
          'Parsemer d\'amandes grillées avant de servir.',
        ],
        imageUrl: '/tajine-abricots.jpg',
        createdAt: 1651234567890,
        createdBy: '2',
        votes: 5,
        voterIds: ['1', '2'],
      },
    ];
    localStorageService.setRecipeVariants(initialVariants);
  },
};
