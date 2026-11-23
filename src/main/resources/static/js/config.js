
const SITIO = {
  nombre: "Fortiachiras",

  whatsapp: "573173256451",

  videoYoutube: "vpqX9v9M1Tc",

  // Datos del pie de página 
  contacto: {
    direccion: { es: "Carrera 5A No. 5-124, Fortalecillas, Huila", en: "Carrera 5A No. 5-124, Fortalecillas, Huila", fr: "Carrera 5A No. 5-124, Fortalecillas, Huila" },
    telefonos: ["3173256451", "3114672768"],
    horario: { es: "Fortalecillas: 8:00 a. m. a 7:00 p. m., jornada continua", en: "Fortalecillas: 8:00 a.m. to 7:00 p.m., open all day", fr: "Fortalecillas : de 8 h à 19 h, sans interruption" },
    correo: ""
  },

  // Redes sociales: Muy pronto
  redes: { facebook: "", instagram: "", tiktok: "", youtube: "" },

  // Franja de cifras del inicio 
  cifras: [
    { valor: "70", etiqueta: { es: "años de tradición", en: "years of tradition", fr: "ans de tradition" } },
    { valor: "3", etiqueta: { es: "puntos de venta", en: "points of sale", fr: "points de vente" } },
    { valor: "15+", etiqueta: { es: "productos", en: "products", fr: "produits" } },
    { valor: "10", etiqueta: { es: "pasos artesanales", en: "handmade steps", fr: "étapes artisanales" } }
  ],

  // Frase destacada de la página Cultura
  fraseCultura: {
    es: "Poquito a poco, de las canastas de la plaza central de Neiva a todo el Huila.",
    en: "Little by little, from the baskets of Neiva's central square to all of Huila.",
    fr: "Petit à petit, des paniers de la place centrale de Neiva jusqu'à tout le Huila."
  },

  // Cultura del Huila
  huila: [
    { foto: "portada-cultura.jpg",
      titulo: { es: "Desierto de la Tatacoa", en: "Tatacoa Desert", fr: "Désert de la Tatacoa" },
      texto: { es: "En Villavieja, sorprende con paisajes de tonos ocres y grises, fósiles y cielos muy claros, ideales para mirar las estrellas.",
               en: "In Villavieja, it amazes with ochre and gray landscapes, fossils and very clear skies, ideal for stargazing.",
               fr: "À Villavieja, il surprend par ses paysages ocre et gris, ses fossiles et ses ciels très clairs, idéaux pour observer les étoiles." } },
    { foto: "huila-sanagustin.jpg",
      titulo: { es: "Parque Arqueológico de San Agustín", en: "San Agustín Archaeological Park", fr: "Parc archéologique de San Agustín" },
      texto: { es: "Patrimonio de la Humanidad de la UNESCO, guarda uno de los conjuntos de esculturas megalíticas más importantes de América del Sur.",
               en: "A UNESCO World Heritage Site, it holds one of the most important groups of megalithic sculptures in South America.",
               fr: "Patrimoine mondial de l'UNESCO, il abrite l'un des plus importants ensembles de sculptures mégalithiques d'Amérique du Sud." } },
    { foto: "huila-nevado.jpg",
      titulo: { es: "Nevado del Huila", en: "Nevado del Huila", fr: "Nevado del Huila" },
      texto: { es: "El volcán más alto de Colombia, rodeado de páramos y de naturaleza protegida.",
               en: "The highest volcano in Colombia, surrounded by high moorlands and protected nature.",
               fr: "Le plus haut volcan de Colombie, entouré de páramos et d'une nature protégée." } }
  ],

  // Bambuco
  bambuco: {
    foto: "huila-bambuco.jpg",
    titulo: { es: "El bambuco y las fiestas de San Pedro", en: "Bambuco and the San Pedro festivities", fr: "Le bambuco et les fêtes de San Pedro" },
    textos: {
      es: ["El bambuco es uno de los ritmos más representativos de la música andina colombiana, y en el Huila se canta y se baila con orgullo. Junto al sanjuanero huilense, es protagonista de las fiestas de San Juan y San Pedro.",
           "A finales de junio, Neiva se llena de música, danza y color con el Festival Folclórico y Reinado Nacional del Bambuco."],
      en: ["Bambuco is one of the most representative rhythms of Colombian Andean music, and in Huila it is sung and danced with pride. Together with the sanjuanero huilense, it is the star of the San Juan and San Pedro festivities.",
           "At the end of June, Neiva fills with music, dance and color during the Folk Festival and National Bambuco Pageant."],
      fr: ["Le bambuco est l'un des rythmes les plus représentatifs de la musique andine colombienne, et dans le Huila on le chante et on le danse avec fierté. Avec le sanjuanero huilense, il est la vedette des fêtes de San Juan et de San Pedro.",
           "À la fin du mois de juin, Neiva se remplit de musique, de danse et de couleurs avec le Festival Folclórico y Reinado Nacional del Bambuco."]
    }
  },

  // Visitas a la fábrica (candidatas del Reinado Nacional de Belleza)
  visitas: [
    { foto: "visita-1.jpg",
      titulo: { es: "Candidatas del Reinado Nacional de Belleza", en: "Candidates of the National Beauty Pageant", fr: "Candidates du Reinado Nacional de Belleza" },
      detalle: { es: "Visitaron nuestra fábrica", en: "They visited our factory", fr: "Elles ont visité notre usine" } },
    { foto: "visita-2.jpg",
      titulo: { es: "Conociendo cómo se hace el bizcocho", en: "Seeing how the bizcocho is made", fr: "Découvrir comment se fait le bizcocho" },
      detalle: { es: "Candidatas del Reinado Nacional de Belleza", en: "Candidates of the National Beauty Pageant", fr: "Candidates du Reinado Nacional de Belleza" } }
  ],

  // El bizcocho en la mesa huilense
  mesa: [
    { foto: "mesa-1.jpg", titulo: { es: "Para tardear", en: "For the afternoon", fr: "Pour le goûter" },
      texto: { es: "Con una Kola Cóndor bien fría, el bizcocho es el plan perfecto de la tarde.", en: "With an ice-cold Kola Cóndor, the bizcocho is the perfect afternoon plan.", fr: "Avec un Kola Cóndor bien frais, le bizcocho est le plan parfait de l'après-midi." } },
    { foto: "mesa-2.jpg", titulo: { es: "Con arequipe", en: "With arequipe", fr: "Avec de l'arequipe" },
      texto: { es: "Combinado con arequipe, es un antojo que nunca falla.", en: "Paired with arequipe (dulce de leche), it is a treat that never fails.", fr: "Associé à l'arequipe (dulce de leche), c'est une gourmandise qui ne déçoit jamais." } },
    { foto: "mesa-3.jpg", titulo: { es: "Chocolate o aguapanela", en: "Chocolate or aguapanela", fr: "Chocolat ou aguapanela" },
      texto: { es: "Un buen desayuno con chocolate bien caliente o aguapanela.", en: "A good breakfast with hot chocolate or aguapanela.", fr: "Un bon petit-déjeuner avec du chocolat bien chaud ou de l'aguapanela." } },
    { foto: "mesa-4.jpg", titulo: { es: "El migao", en: "El migao", fr: "Le migao" },
      texto: { es: "El bizcocho es fundamental en el reconocido desayuno huilense llamado el migao.", en: "The bizcocho is essential in the well-known Huila breakfast called el migao.", fr: "Le bizcocho est essentiel dans le célèbre petit-déjeuner du Huila appelé el migao." } }
  ],

  // Proceso de elaboración
  ingredientes: {
    es: ["Queso", "Harina de sagú", "Huevos", "Panela", "Sal", "Color", "Mantequilla"],
    en: ["Cheese", "Sagú flour", "Eggs", "Panela", "Salt", "Food coloring", "Butter"],
    fr: ["Fromage", "Farine de sagú", "Œufs", "Panela", "Sel", "Colorant", "Beurre"]
  },
  pasos: [
    { foto: "proceso-ingredientes.jpg", t: { es: "Alistar los ingredientes", en: "Prepare the ingredients", fr: "Préparer les ingrédients" },
      d: { es: "Queso, harina de sagú, huevos, panela, sal, color y mantequilla.", en: "Cheese, sagú flour, eggs, panela, salt, food coloring and butter.", fr: "Fromage, farine de sagú, œufs, panela, sel, colorant et beurre." } },
    { foto: "proceso-queso.jpg", t: { es: "Prensar el queso", en: "Press the cheese", fr: "Presser le fromage" },
      d: { es: "Se extrae la mayor cantidad posible de suero, hasta dejarlo deshidratado.", en: "As much whey as possible is removed until the cheese is dehydrated.", fr: "On en extrait le plus de petit-lait possible, jusqu'à le déshydrater." } },
    { foto: "proceso-mezclado.jpg", t: { es: "Mezclar", en: "Mix", fr: "Mélanger" },
      d: { es: "Se juntan todos los ingredientes.", en: "All the ingredients are combined.", fr: "On réunit tous les ingrédients." } },
    { foto: "proceso-moler.jpg", t: { es: "Moler", en: "Grind", fr: "Moudre" },
      d: { es: "Se muele la mezcla hasta lograr una masa homogénea.", en: "The mixture is ground until the dough is smooth and even.", fr: "On moud le mélange jusqu'à obtenir une pâte homogène." } },
    { foto: "proceso-amasado.jpg", t: { es: "Amasar", en: "Knead", fr: "Pétrir" },
      d: { es: "Se amasa para dejar la masa lista para moldear.", en: "The dough is kneaded until it is ready to be shaped.", fr: "On pétrit pour que la pâte soit prête à être façonnée." } },
    { foto: "proceso-rosqueado.jpg", t: { es: "Rosquear", en: "Shape by hand", fr: "Façonner à la main" },
      d: { es: "Cada bizcocho se moldea a mano, uno por uno.", en: "Each bizcocho is shaped by hand, one by one (called rosqueado).", fr: "Chaque bizcocho est façonné à la main, un par un (le rosqueado)." } },
    { foto: "proceso-acomodar.jpg", t: { es: "Acomodar en latas", en: "Place on trays", fr: "Disposer sur les plaques" },
      d: { es: "Los bizcochos se colocan en latas para llevarlos al horno.", en: "The bizcochos are placed on baking trays and taken to the oven.", fr: "Les bizcochos sont placés sur des plaques pour aller au four." } },
    { foto: "proceso-horno.jpg", t: { es: "Hornear", en: "Bake", fr: "Cuire" },
      d: { es: "Se asan en horno de barro.", en: "They are baked in a clay oven.", fr: "Ils sont cuits dans un four en terre." } },
    { foto: "proceso-tostado.jpg", t: { es: "Tostar", en: "Toast", fr: "Griller" },
      d: { es: "Es el último proceso de fabricación y deja el bizcocho listo para consumir.", en: "The last step of production, leaving the bizcocho ready to eat.", fr: "C'est la dernière étape de fabrication ; elle laisse le bizcocho prêt à être consommé." } },
    { foto: "proceso-empaque.jpg", t: { es: "Empacar", en: "Pack", fr: "Emballer" },
      d: { es: "Queda listo para su comercialización.", en: "Ready to be sold.", fr: "Il est prêt à être commercialisé." } }
  ],

  // Puntos de venta
  puntos: {
    1: { foto: "punto-fortalecillas.jpg", mapa: "Carrera 5A 5-124, Fortalecillas, Huila, Colombia" },
    2: { foto: "punto-bogota.jpg", mapa: "Carrera 24 # 26B Sur 35, Centenario, Bogotá, Colombia" },
    3: { foto: "punto-rutas.jpg", mapa: "Huila, Colombia" }
  }
};
