// Elements focusables au sein de la modale
const focusableSelector = "button, a, i, input, textarea";
// Variable d'état de la modale
let modal = null;
// Permet de mettre à jour l'ancien focus en sortie de modale
let previouslyFocusedElement = null;
let focusables = [];


// Fonction d'ouverture de modale prenant en paramètre l'événement 
const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  // Grâce à from, on convertit la nodeList en tableau que l'on pourra parcourir
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  // Sauvegarde de l'élément focus avant l'ouverture de la modale
  previouslyFocusedElement = document.querySelector(":focus");
  modal.style.display = null;
  // On met le premier élément du tableau en focus par défaut
  focusables[0].focus();
  // Accessible Reach Internet Application
  // On utilise le standard aria pour masquer/afficher nos boîtes modales
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  // Au clic dans la modale, on execute la fonction de fermeture
  modal.addEventListener("click", closeModal);
  // Au clic sur le bouton de fermeture, on execute la fonction de fermeture
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  // On empêche la propagation de l'événement vers le conteneur parent
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

// Fonction de fermeture de modale
const closeModal = function (e) {
  if (modal === null) return;
  // A la fermeture de la boîte modale, on redonne le focus à l'élément ciblé avant l'ouverture si il y en avait
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();
  // Délai avant la fermeture de la modale (Pour la gestion de l'animation)
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 600);
  // On utilise le standard aria pour masquer/afficher nos boîtes modales
  modal.setAttribute("aria-hidden", "true");
  // On nettoie nos attributs et nos EventListener
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
};

// Fonction d'empêchement de propagation
const stopPropagation = function (e) {
  e.stopPropagation();
};

// Fonction qui permet de focus sur les éléments focusables définis
const focusinModal = function (e) {
  e.preventDefault();
  // Fonction nous permettant de trouver l'index de l'élément actuellement focus
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  // On écoute Shift pour changer le sens ou non
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  // Boucle infinie 
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  // On applique la méthode focus à l'élément focus
  focusables[index].focus();
};
// Au clic sur un de nos sélécteurs js-modal, nous déclenchons la fonction d'ouverture de modale
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// On écoute les touches du clavier "Esc" et "Tab" pour y associer des fonctions avec en paramètre l'événement
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusinModal(e);
  }
});
