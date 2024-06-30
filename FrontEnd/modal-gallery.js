// Cette fonction permet simplement d'afficher la galerie au sein de la modale
const modalGallery = document.querySelector(".modal-gallery");
let modalAllWorks = [];
const modalPrev = document.querySelector(".js-modal-prev");
const modalClose = document.querySelector(".js-modal-close");

const modalGalleryDisplay = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    const data = await response.json();
    modalAllWorks = data;
    for (let i = 0; i < data.length; i++) {
      const figElement = document.createElement("figure");
      const imgElement = document.createElement("img");
      const logoElement = document.createElement("i");
      const lienLogo = document.createElement("a");

      imgElement.src = data[i].imageUrl;
      logoElement.classList.add("fa-solid");
      logoElement.classList.add("fa-trash-can");
      logoElement.classList.add("logoDelete-style");
      lienLogo.classList.add("lien-logo");

      figElement.appendChild(imgElement);
      figElement.appendChild(logoElement);
      logoElement.appendChild(lienLogo);

      modalGallery.appendChild(figElement);

      console.log("=> Nombre de projets récupérés depuis l'API");
    }
  } catch {
    console.log("Il y a une erreur dans la fonction");
  }
};

modalGalleryDisplay();

// Cette fonction via écouteur d'événement permet d'afficher la seconde modale au clic sur "Ajouter un projet"

document.getElementById("modal2Link").addEventListener("click", function () {
  document.querySelector(".modal-wrapper").style.display = "none";
  document.querySelector(".modal-wrapper2").style.display = "flex";
  document
    .querySelector(".modal-wrapper2")
    .addEventListener("click", stopPropagation);
});

modalPrev.addEventListener("click", function () {
  document.querySelector(".modal-wrapper").style.display = "flex";
  document.querySelector(".modal-wrapper2").style.display = "none";
});

modalClose.addEventListener("click", closeModal, () => {
  console.log("founded");
});
