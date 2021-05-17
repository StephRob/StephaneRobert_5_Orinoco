// On appelle la sonction summary pour afficher le panier complet
(async function summary() {
  // (1)* On appelle la fonction getItems que l'on stock dans la constante items
  const items = await getItems()
  // (2)* On appelle la fonction getItemsData
  getItemsData(items)
})()

// (1) On va chercher les éléments à l'adresse de l'api donnée
function getItems() {
  // Utilisation de la methode FETCH  pour effectuer la requete
  return fetch("http://localhost:3000/api/cameras")
    .then(response => response.json())
    .then(items => items)
    .catch(error => console.error(error))
}

// (2) On recupère les données des items prèsents dans le panier
function getItemsData(items) {
  let totalPrice = 0
  if (localStorage.getItem("cart")) {
    let cartTab = localStorage.getItem("cart").split(',')
    for (let i = 0; i < cartTab.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (items[j]._id === cartTab[i]) {
          // On calcul le prix total à afficher
          totalPrice += (items[j].price / 100)
          // (3)* On appelle la fonction appendProductInCart pour chaque item correspondant
          appendProductInCart(items[j])
        }
      }
    }
  }
  document.querySelector("#totalPrice").textContent = totalPrice + "€"
}

// (3) On affiche les produits présents dans le panier
function appendProductInCart(items) {
  // On prépare le template d'affichage d'un produit dans le panier
  const templateTable = document.querySelector("#templateTable")
  // On clone le template
  const cloneTR = document.importNode(templateTable.content, true)
  // On modifie les zones de texte du panier
  cloneTR.querySelector("#tableProductName").textContent = items.name
  cloneTR.querySelector("#tableProductPrice").textContent = (items.price / 100) + "€"
  // On affiche le template cloné dans le tableau
  document.querySelector("#tableBody").appendChild(cloneTR)
}

// On verifie si le panier est vide ou non
(function isEmpty() {
  const emptyCart = document.querySelector('.empty-cart')
  const noEmptyCart = document.querySelector('.no-empty-cart')
  // si le panier n'est pas vide on affiche la section Cart
  if (localStorage.getItem("cart")) {
    emptyCart.style.display = "none"
    noEmptyCart.style.display = "flex"
  }
})()

// On vide le panier au clic sur le bouton "vider le panier"
document.querySelector("#clear-cart").addEventListener("click", function () {
  localStorage.clear()
  document.location.reload()
})

// On déclare toute les variables de champs du formulaire
const firstname = document.querySelector('#firstname')
const lastname = document.querySelector('#lastname')
const email = document.querySelector('#email')
const address = document.querySelector('#address')
const city = document.querySelector('#city')
const zip = document.querySelector('#zip')

// On formate les données à envoyer au back au clic de validation de la commande
function submitOrder() {
  // On declare les variables du contenu des champs du formulaire
  const firstnameValue = firstname.value
  const lastnameValue = lastname.value
  const emailValue = email.value
  const addressValue = address.value
  const cityValue = city.value

  // On céer le tableau de product_id à envoyer au back
  const products = localStorage.getItem("cart").split(',')
  // on créer l'objet "order" pour le back
  const order = {
    // Objet contact contenant les données utilisateur
    contact: {
      firstName: firstnameValue,
      lastName: lastnameValue,
      address: addressValue,
      city: cityValue,
      email: emailValue
    },
    //Tableau de product_id crée précedemment
    products: products
  }

  // On créer les options de promise pour la methode "POST"
  const promiseOptions = {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }

  // Utilisation de la methode FETCH  pour effectuer la requete 
  fetch("http://localhost:3000/api/cameras/order", promiseOptions)
    .then(response => response.json())
    .then(order => {
      // On supprime la clé cart du localStorage
      localStorage.removeItem('cart');
      // On créer la clé order contenant les infos retournées par le serveur pour les utilisés dans la confirmation de commande
      sessionStorage.setItem('order', JSON.stringify(order))
      // On redirige vers la page de confirmation de commande
      window.location.href = "./order.html"
    })
    .catch(error => console.error(error))
}

// On valide les champs du formulaire avant envoie
function validate() {
  // On rend les champs obligatoires
  firstname.required = true
  lastname.required = true
  email.required = true
  address.required = true
  city.required = true
  zip.required = true
  // On paramètre le pattern des différents champs
  firstname.setAttribute("pattern", "[^0-9]{2,}")
  lastname.setAttribute("pattern", "[^0-9]{2,}")
  email.setAttribute("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,}$")
  city.setAttribute("pattern", "[^0-9]{2,}")
  zip.setAttribute("pattern", "[0-9]{5}")
}

// On gère la désactivation des soumissions de formulaires s'il y a des champs non valides
// Début de code fournit par bootstrap 
(function () {
  'use strict'
  window.addEventListener('load', function () {
    // On récupére tous les formulaires auxquels nous voulons appliquer des styles de validation Bootstrap personnalisés
    var forms = document.getElementsByClassName('needs-validation')
    // On boucle sur les formulaires pour empêcher la soumission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        // On appelle la fonction validate
        validate()
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          event.preventDefault()
          // on appelle la fonction submitorder si toute les validations du formulaire sont passées
          submitOrder()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
})()
