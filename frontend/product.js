// (4) on affiche de manière asynchrone les infos du produit avec une fonction auto invoquée
(async function productData() {
  // (1)* On appelle la fonction getParamId que l'on stock dans la constante paramId
  const paramId = getParamId()
  // (2)* On appelle la fonction getProduct avec la constante paramId en paramètre que l'on stock dans la constante product
  const product = await getProduct(paramId)
  // (3)* On appelle la fonction appendProduct
  appendProduct(product)
})()

// (1) on récupère le paramètre id de l'url
function getParamId() {
  let url = new URL(window.location.href)
  let param = url.searchParams.get("id")
  // on retourne la valeur du paramètre id de l'url
  return param
}

// (2) on récupère les données du produit grace à son id
function getProduct(paramId) {
  // Utilisation de la methode FETCH  pour effectuer la requete
  return fetch("http://localhost:3000/api/cameras/" + paramId)
    .then(response => response.json())
    .then(product => product)
    .catch(error => console.error(error))
}

// (3) on affiche les infos du produit
function appendProduct(product) {
  // On modifie les zones de texte du produit
  document.querySelector("#product-title").textContent = product.name
  document.querySelector("#product-description").textContent = product.description
  document.querySelector("#product-price").textContent = (product.price / 100) + "€"
  document.querySelector("#product-img").src = product.imageUrl
  // on boucle sur le tableau des lenses pour les afficher en les insérants dans une balise option
  for (const lense of product.lenses) {
    const optionElt = document.createElement("option")
    optionElt.textContent = lense
    document.querySelector("#select-lense").appendChild(optionElt)
  }
  // (3bis)* on appelle la fonction addToCart pour ajour le produit au panier
  addToCart(product)
}

// (3bis) on ajoute le produit (_id) au panier
function addToCart(product) {
  let cartTab = localStorage.getItem("cart")
  // on verifie si la clé de stockage cart existe
  // si existe: on creer un nouveau tableau de string séparés par des virgules
  // si existe pas: on creer un tableau vide
  cartTab = cartTab ? cartTab.split(',') : []
  //on cherche si le produit est déjà present dans le panier
  let foundProduct = cartTab.find(elt => elt === product._id)

  if (foundProduct) {
    // si le produit est présent dans le panier, un message indique sa présence au panier et son ajout est impossible
    const msg = document.querySelector(".confirm-add-to-cart")
    msg.textContent = "Cet article est déjà dans votre panier"
    msg.style.color = "red"
    msg.style.visibility = "visible"
    document.querySelector("#card-link").setAttribute("disabled", "")
  } else {
    // si le produit n'est pas présent dans le panier on ajoute l'evenement click sur le bouton d'ajout
    document.querySelector("#card-link").addEventListener('click', function (e) {
      e.preventDefault()
      // on ajoute l'id du produit dans le tableau vide créer précedemment
      cartTab.push(product._id)
      // on créer l'emplacement de stockage 'cart' et on y stock le tableau de product_id 'cartTab'
      localStorage.setItem('cart', cartTab)
      // on fait apparaitre les boutons panier et retour au produit
      document.querySelector(".add-to-cart-btn").style.display = "none"
      document.querySelector(".confirm-add-to-cart").style.visibility = "visible"
      document.querySelector(".added-to-cart").style.display = "block"
      // on met a jour le nombre de produit du badge dans le header
      let nbProduct = localStorage.getItem("cart").split(',').length
      document.querySelector("#cart-badge").textContent = nbProduct
    })
  }
}
