// On affiche les détails de la commande
(() => {
  const firstName = document.querySelector('#firstName')
  const orderId = document.querySelector('#orderId')
  const totalPrice = document.querySelector('#totalPrice')
  // on récupère le la clé de stockage 'order' puis on parse l'objet
  let orderContent = JSON.parse(sessionStorage.getItem("order"))
  // on calcul le prix total du panier
  let price = 0
  for (const product of orderContent.products) {
    price += product.price / 100
  }
  // on remplace le contenu du message de validation de commande par les données de la clé 'order'
  firstName.textContent = orderContent.contact.firstName
  orderId.textContent = orderContent.orderId
  totalPrice.textContent = price + '€'
})()
