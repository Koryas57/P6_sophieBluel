// On pointe nos variable vers les éléments que l'on utilisera plus tard
const modalGallery = document.querySelector(".modal-gallery");
let modalAllWorks = [];
const modalPrev = document.querySelector(".js-modal-prev");
const modalClose = document.querySelector(".js-modal-close");
const token = localStorage.getItem("token");
const imgPreview = document.querySelector("#preview");
const fileUpload = document.querySelector(".file-upload");
// Verifier répétitions des deux prochaines const
const titleInput = document.getElementById('title');
const categorySelector = document.getElementById('categorySelector');
const modalButton2 = document.querySelector("#modale-button2");
//URL de base qui est commune
const BASE_URL = 'http://localhost:5678/api/';


// Méthode créée pour gérer le click sur l'icone de suppression de projet 
const handleLogoElementClick = (event) => {

  if (event.target.getAttribute("data-workId")) {
    const workId = parseInt(event.target.getAttribute("data-workId"));
    console.log(token);
    console.log("Le workId est :", workId);
    deleteData(workId);
  }
};

// Cette fonction nous permet d'afficher la galerie de projets
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

      imgElement.src = modalAllWorks[i].imageUrl;
      logoElement.classList.add("fa-solid");
      logoElement.classList.add("fa-trash-can");
      logoElement.classList.add("logoDelete-style");
      lienLogo.classList.add("lien-logo");
      logoElement.setAttribute("data-workId", modalAllWorks[i].id);//J'ai mis cet attribut data-workId directement sur l'icone trash qui supprime un work
      figElement.appendChild(imgElement);
      figElement.appendChild(logoElement);
      logoElement.appendChild(lienLogo);

      modalGallery.appendChild(figElement);

      console.log("L'id est :", modalAllWorks[i].id);
      console.log("=> Nombre de projets récupérés depuis l'API");
    }

  } catch {
    console.error("Il y a une erreur dans la fonction");
  }
};

// Dès l'execution de la fonction ,nous executons le script suivant =>

modalGalleryDisplay().then(() => {
  const logoElements = document.querySelectorAll(".logoDelete-style");//Je vais sélectionner toutes les icones poubelles
  logoElements.forEach((logoElement) => {
    logoElement.addEventListener("click", handleLogoElementClick);//Pour chaque élément j'appelle handleLogoElementClick pour supprimer le projet cliqué
  });
});


// Methode pour la suppression de projet

const deleteData = async (workId) => {
  const url = `http://localhost:5678/api/works/${workId}`;
  console.log("Deleting work with ID:", workId);
  console.log("Using token:", token);

  if (!token) {
    alert("Vous devez être connecté pour effectuer cette action");
    return;
  }

  const confirmation = confirm(" Etes-vous sûr de vouloir supprimer ce projet ? ");
  if (!confirmation) {
    return;
  }

  try {
    let response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Work deleted with ID:", workId);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Cette méthode permet d'afficher la seconde modale au clic sur "Ajouter un projet"

document.getElementById("modal2Link").addEventListener("click", function () {
  document.querySelector(".modal-wrapper").style.display = "none";
  document.querySelector(".modal-wrapper2").style.display = "flex";
  document
    .querySelector(".modal-wrapper2")
    .addEventListener("click", stopPropagation);
  imgPreview.style.display = "none";
  selectCategories();
});

modalPrev.addEventListener("click", function () {
  document.querySelector(".modal-wrapper").style.display = "flex";
  document.querySelector(".modal-wrapper2").style.display = "none";
});

// Au clic sur Ajouter une photo
const addPicture = document.querySelector("#addFileBtn input")
// Pour ajouter une image
addPicture.addEventListener("change", async function (event) {
  const selectedFile = event.target.files[0];
  const ACCEPTED_EXTENSIONS = ["png", "jpg", "jpeg"];
  const fileName = selectedFile.name;
  const extension = fileName.split(".").pop().toLowerCase(); // Pour extraire l'extension du fichier
  if (selectedFile && selectedFile.size <= 4 * 1024 * 1024 && ACCEPTED_EXTENSIONS.includes(extension)) { // 4MB max
    const reader = new FileReader(); /* permet à des applications web de lire le contenu de fichiers de facon asynchrone */
    reader.onload = async function (e) { /* permet d'appeler le chargement */
      imgPreview.src = e.target.result; // Mise à jour de l'aperçu de l'image
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(selectedFile); /* utilisée afin de lire le contenu d'un blob */
  } else {
    alert("Le fichier est trop volumineux ou a une extension incorrecte. Veuillez sélectionner un fichier de moins de 4 Mo.");
  }
});

let form = document.querySelector("#modal2 form");
// Gérer la soumission du formulaire
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Empêcher la soumission par défaut
  await uploadImage(); // Appel de la fonction pour upload le fichier
});
// Appel de l'API
// Pour transformer l'image en blob (binary large object) afin de faciliter le téléversement.
const dataURLtoBlob = async (dataurl) => {
  const response = await fetch(dataurl);
  const blob = await response.blob();
  return blob;
};
// Méthode pour télécharger l'image
const uploadImage = async () => {
  //il a été fait à plusieurs reprises, on peut le simplifier à voir demain dimanche
  if (!token) {
    alert("Vous devez être connecté pour effectuer cette action");
    return;
  }
  const title = document.querySelector("#title").value;
  const categoryIndex = document.querySelector("#categorySelector").selectedIndex;
  const categoryName = document.querySelector("#categorySelector").options[categoryIndex].innerText;
  const selectedFile = addPicture.files[0];
  console.log("selectedFile", selectedFile);
  const reader = new FileReader();
  reader.onloadend = async function (event) {
    try {
      const base64String = event.target.result;
      /*On convertit l'image en blob qui est plus avantageux entre autres,  réduit l'utilisation de la mémoire
      et améliore les performances de l'applications etc */
      const blobImg = await dataURLtoBlob(base64String);
      console.log("blobImg", blobImg);
      const formData = new FormData();
      formData.append('image', blobImg);
      formData.append('title', title);
      formData.append('category', categoryIndex);
      console.log("formData", formData);
      await postDataToBdd(token, formData, title, categoryName);
    } catch (error) {
      console.error('Error converting image or uploading file:', error);
    }
  };
  reader.readAsDataURL(selectedFile);
};

const postDataToBdd = async (token, formData, title, categoryName) => {
  console.log("token", token);
  const urlPostWork = `${BASE_URL}works`;
  const confirmation = confirm(`Voulez-vous ajouter ${title} à la galerie ?`);
  if (!confirmation) return;
  try {
    const response = await fetch(urlPostWork, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Successful response:', responseData);
    addToWorksData(responseData, categoryName);
    gallery.innerHTML = ""; // Vider le contenu de la galerie
    //Rafraichir la galérie
    galleryDisplay();
    // Masquer la galerie ajout photo
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
  }
};
// Ajouter les données à la galerie
const addToWorksData = (data, optionName) => {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = { id: data.categoryIndex, name: optionName };
  newWork.imageUrl = data.imageUrl;
  allWorks.push(newWork);
};

//Mettre à jour l'état du bouton "Valider"
const updateSubmitButtonState = () => {
  const title = titleInput.value.trim();//On enlève les espaces du title
  const categorySelected = document.getElementById('categorySelector').selectedIndex > 0;
  const imageLoaded = addPicture.files.length > 0;
  console.log('title:', title, 'categorySelected:', categorySelected, 'imageLoaded:', imageLoaded);
  console.log('modalButton2:', modalButton2);
  if (title && categorySelected && imageLoaded) {
    modalButton2.classList.remove('buttonDisabled');
    modalButton2.classList.add('buttonEnabled');
    modalButton2.disabled = false;
  } else {
    modalButton2.classList.add('buttonDisabled');
    modalButton2.disabled = true;
  }
}

// Ajoutez des écouteurs d'événements pour surveiller les modifications des champs de formulaire
titleInput.addEventListener('input', updateSubmitButtonState);
categorySelector.addEventListener('change', updateSubmitButtonState);
addPicture.addEventListener('change', updateSubmitButtonState);

updateSubmitButtonState();
