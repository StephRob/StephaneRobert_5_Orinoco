// (3) on affiche de manière asynchrone les produits avec une fonction auto invoquée
(async function appendAllProducts() {
  // (1)* On appelle lan fonction getItems que l'on stock dans la constante items
  const items = await getItems()
  // (2)* On appelle la fonction appendItem pour chaque item
  for (item of items) {
    appendItem(item)
  }
})()

// (1) On va chercher les éléments à l'adresse de l'api donnée
function getItems() {
  // Utilisation de la methode FETCH  pour effectuer la requete
  return fetch("http://localhost:3000/api/cameras")
    .then(response => response.json())
    .then(items => items)
    .catch(error => console.error(error))
}

// (2) On affiche un élément présent dans l'api Cameras
function appendItem(item) {
  // On prépare le template d'affichage d'un produit
  const templateElt = document.querySelector("#template")
  // On clone le template
  const cloneElt = document.importNode(templateElt.content, true)
  // On modifie les zones de texte du produit
  cloneElt.querySelector("#card-title").textContent = item.name
  cloneElt.querySelector('#card-description').textContent = item.description
  cloneElt.querySelector("#card-price").textContent = (item.price / 100) + "€"
  cloneElt.querySelector("#card-img").src = item.imageUrl
  cloneElt.querySelector("#card-link").href = "product.html?id=" + item._id // On récupère l'id du produit que l'on passe en paramètre de l'url cible
  // On affiche le template cloné dans la section Cards
  document.querySelector("#cards").appendChild(cloneElt)
}