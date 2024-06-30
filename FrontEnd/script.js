// Conteneur parent
const gallery = document.querySelector(".gallery");
const catContainer = document.querySelector(".filters");
// Log
const log = document.querySelector("#log a");
// Mode édition
const modeEdition = document.querySelector(".edition");
const modifier = document.getElementById("modifier");
const titleSpacing = document.querySelector("#portfolio h2");
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
      console.log("=> Nombre de projets récupérés depuis l'API");
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

// Fonction qui va nous permettre de vérifier le statut de la connexion utilisateur
const checkConnectionStatus = () => {
  // On déclare l'état de base en tant que non connecté
  let connected = false;
  // On vient récupérer le token d'authentification
  const token = localStorage.getItem("token");
  // Si le token existe, on ajoute dynamiquement le mode édition sur la page d'accueil
  if (token) {
    connected = true;
    log.innerHTML = "logout";
    log.href = "index.html";
    log.style.cursor = "pointer";
    catContainer.style.display = "none";
    modeEdition.style.height = "5.5vh";
    modifier.style.visibility = "visible";
    // Si non, nous chargeons la page d'accueil simple
  } else {
    titleSpacing.style.margin = "65px 0 65px 65px";
    log.innerHTML = "login";
    log.href = "login.html";
    modifier.style.visibility = "hidden";
    catContainer.style.display = "flex";
    modeEdition.style.height = "0";
  }

  return connected;
};

// On déclare une fonction qui va nous permettre de se déconnecter correctement
const toggleConnection = () => {
  let connected = checkConnectionStatus();

  if (connected) {
    localStorage.removeItem("token");
    window.location.href = log.href; // Utiliser log.href pour assurer la cohérence de la destination
  } else {
    window.location.href = "login.html"; // Redirection vers la page de connexion
  }
};

// On place un écouteur d'évenement sur le bouton logIn/logOut
log.addEventListener("click", toggleConnection);

document.addEventListener("DOMContentLoaded", () => {
  checkConnectionStatus();
});
