// Fonction de connexion utilisateur
const logIn = async () => {
  // Liaison de la valeur des input du formulaire à des constantes
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Tentative d'envoi des données du formulaire via la requête POST
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      // Définition du protocole HTTP employé
      method: "POST",
      /* Définiton du format de la charge utile accepté par l'API.
        /!\ La propriété headers aura comme valeur un objet contenant lui-même une propriété "Content-Type" et une valeur indiquant le type MIME du format de la charge utile. */
      headers: {
        "Content-Type": "application/json",
      },
      /* Définition de la charge utile de la requête
        /!\ Cet objet doit être converti en une chaîne de caractères au format JSON pour être transmis dans le body de la requête */
      body: JSON.stringify({
        email,
        password,
      }),
    });
    // Conversion de la reponse en format json
    const data = await response.json();
    // On enregistre la valeur de data avec la clé "token" dans le localStorage
    localStorage.setItem("token", JSON.stringify(data.token));
    // On vérifie le token
    console.log(data.token);

    // En cas de succès
    if (response.ok) {
      // Message de confirmation
      console.log("Félicitation, vous êtes connecté !", data);
      // Redirection vers la page d'accueil
      window.location.href = "index.html";
      // Gestion des erreurs relatives à la connexion avec l'API
    } else {
      console.error(
        "La connexion a échouée, veuillez vérifier votre email et/ou mot de passe."
      );
      alert(
        "La connexion a échouée, veuillez vérifier votre email et/ou mot de passe."
      );
    }
    // Gestion des erreurs relatives au bon déroulement du script
  } catch {
    console.error("Erreur lors de la connexion, veuillez réessayer plus tard.");
  }
};

const submit = document.querySelector("section #login-form");
// Positionnement d'un écouteur d'événements sur le bouton Submit du formulaire
submit.addEventListener("submit", async function (event) {
  // On empêche la page de se recharger par défaut au clic sur Submit
  event.preventDefault();
  logIn();
});
