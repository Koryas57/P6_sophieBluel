// Conteneur parent
const gallery = document.querySelector(".gallery");
const catContainer = document.querySelector(".filters");
// Création d'un tableau pour accueillir les travaux
let allWorks = [];
// Création d'un tableau pour accueillir les catégories
let categoryTab = [];

// ***** AFFICHAGE DYNAMIQUE DE LA GALLERIE *****

// Création de la fonction asynchrone qui va récupérer les données [travaux] depuis l'API
const galleryDisplay = async () => {
  try {
    // La constante response envoie une requete GET(par défaut) au serveur web via le chemin indiqué
    const response = await fetch("http://localhost:5678/api/works");

    // La constante data attend d'avoir le résultat de response avant de convertir ce resultat en json
    const data = await response.json();
    allWorks = data;
    // Pour chaque objet de notre tableau, on va {
    for (let i = 0; i < data.length; i++) {
      // Générer une balise img.
      const figElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const caption = document.createElement("figcaption");

      // Modifier de manière dynamique, grâce à l'index [i], la source de l'image
      imgElement.src = data[i].imageUrl;
      caption.innerText = data[i].title;

      // L'affecter au conteneur parent pour pouvoir les relier au DOM
      figElement.appendChild(imgElement);
      figElement.appendChild(caption);
      gallery.appendChild(figElement);

      // Test de fonctionnement en cas d'erreur hors de la fonction
      console.log("L'opération s'est bien déroulée");
    }
  } catch {
    console.log("Il y a une erreur dans la fonction");
  }
};

// Execution de la fonction
galleryDisplay();

// ***** AFFICHAGE DYNAMIQUE DES BOUTONS FILTRES *****

// Création de la fonction asynchrone qui va récupérer les données [catégories] depuis l'API
const filterDisplay = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    // Inscription des catégories dans le tableau
    categoryTab = data;
    // Permet d'ajouter un objet au DEBUT du tableau
    categoryTab.unshift({
      id: 0,
      name: "Tous",
    });
    // Pour chaque objet de notre tableau, nous allons faire l'itération suivante {}
    for (let category of categoryTab) {
      const button = document.createElement("button");
      button.innerHTML = category.name;
      // Permet d'ajouter un attribut à un élément, ici un id
      button.setAttribute("data-category", category.id);
      catContainer.appendChild(button);
    }
  } catch {
    console.error("Il y a une erreur");
  }
};

filterDisplay();

// ***** GESTION DU CLIC VIA UN ECOUTEUR D'EVENEMENT *****

// On positionne un écouteur d'évènements au "click" sur le conteneur parent des filtres
catContainer.addEventListener("click", (e) => {
  // On rassemble tous les boutons issus de filterDisplay dans une constante
  const allButtons = document.querySelectorAll(".filters button");
  // On vérifie si l'élément cliqué possède un attribut "data-category"
  if (e.target.getAttribute("data-category")) {
    // Dans ce cas, pour chaque boutons nous supprimerons la classe .active-filter
    allButtons.forEach((button) => {
      button.classList.remove("active-filter");
    });
    // Test de fonctionnement en cas d'erreur hors de la fonction
    console.log("classe supprimée");
    // Grâce à parseInt nous convertissons la valeur reçue dans le getAttribut en Number
    const catId = parseInt(e.target.getAttribute("data-category"));
    // Nous ajoutons enfin la classe .active-filter à l'élément cliqué, ici (e), pour confirmer visuellement la séléction
    e.target.classList.add("active-filter");
    // Execution de la fonction filters avec en paramètre la valeur reçue via la constante catId
    filters(catId);
  }
});

// ***** DEFINITION DE LA LOGIQUE DU FILTRE *****

// Création de la fonction filters qui va définir le comportement du filtre
const filters = (filtersCategoryId) => {
  // On vide d'abord la div gallery de tous ses éléments
  gallery.innerHTML = "";

  // Si la valeur de l'attribut de l'élément cliqué est === 0, nous allons alors recréer et afficher tous les éléments du tableau
  if (filtersCategoryId === 0) {
    for (let work of allWorks) {
      const figElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const caption = document.createElement("figcaption");
      imgElement.src = work.imageUrl;
      caption.innerHTML = work.title;
      figElement.appendChild(imgElement);
      figElement.appendChild(caption);
      gallery.appendChild(figElement);
    }
  } else {
    // Sinon, pour chaque élement du tableau, si le categoryId d'un d'entre eux === au categoryId d'un des boutons générés, nous allons alors créer et afficher ces éléments
    for (let work of allWorks) {
      if (work.categoryId === filtersCategoryId) {
        const figElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const caption = document.createElement("figcaption");
        imgElement.src = work.imageUrl;
        caption.innerHTML = work.title;
        figElement.appendChild(imgElement);
        figElement.appendChild(caption);
        gallery.appendChild(figElement);
      }
    }
  }
};

filters();
