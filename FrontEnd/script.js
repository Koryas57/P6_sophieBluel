// Conteneur parent
const gallery = document.querySelector(".gallery");

// Création de la fonction asynchrone qui va récupérer les données depuis l'API
async function galleryDisplay() {
  try {
    // La constante response envoie une requete GET(par défaut) au serveur web via le chemin indiqué
    const response = await fetch("http://localhost:5678/api/works");

    // La constante data attend d'avoir le résultat de response avant de convertir ce resultat en json
    const data = await response.json();

    // Pour chaque objet de notre tableau, on va {
    for (let i = 0; i < data.length; i++) {
      // Générer une balise img.
      const imgElement = document.createElement("img");
      // Modifier de manière dynamique, grâce à l'index [i], la source de l'image
      imgElement.src = data[i].imageUrl;
      // L'affecter au conteneur parent pour pouvoir les relier au DOM
      gallery.appendChild(imgElement);
      // Test de fonctionnement en cas d'erreur hors de la fonction
      console.log("L'opération s'est bien déroulée");
    }
  } catch {
    console.log("Il y a une erreur dans la fonction");
  }
}

// Execution de la fonction
galleryDisplay();
