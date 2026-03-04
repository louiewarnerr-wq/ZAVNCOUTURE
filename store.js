let cart = [];

function addToCart(name, price){

cart.push({name, price});

localStorage.setItem("zavnCart", JSON.stringify(cart));

alert(name + " added to cart");

}

function loadCart(){

cart = JSON.parse(localStorage.getItem("zavnCart")) || [];

let cartHTML = "";

cart.forEach(item => {

cartHTML += `<p>${item.name} - £${item.price}</p>`;

});

document.getElementById("cartItems").innerHTML = cartHTML;

}
