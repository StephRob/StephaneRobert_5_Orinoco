// On recupere le nombre de produit présents dans le panier
(() => {
  const badge = document.querySelector("#cart-badge")
  if (localStorage.getItem("cart")) {
    let nbProduct = localStorage.getItem("cart").split(',').length
    badge.textContent = nbProduct
  }
})()
