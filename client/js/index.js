const mercadopago = new MercadoPago('APP_USR-9a464dc4-1ad8-4646-af03-1f18d41cd90c', {
  locale: 'es-CO'
});

// Handle call to backend and generate preference.
document.getElementById("checkout-btn").addEventListener("click", function () {

  $('#checkout-btn').attr("disabled", true);

  const orderData = {
    quantity: document.getElementById("quantity").value,
    description: document.getElementById("product-description").innerHTML,
    price: document.getElementById("unit-price").innerHTML
  };

  fetch("/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      console.log(preference)
      createCheckoutButton(preference.id);
      $(".shopping-cart").fadeOut(500);
      setTimeout(() => {
        $(".container_payment").show(500).fadeIn();
      }, 500);
    })
    .catch(function () {
      alert("Unexpected error");
      $('#checkout-btn').attr("disabled", false);
    });
});

// Create preference when click on checkout button
function createCheckoutButton(preferenceId) {
  console.log(preferenceId)
  // Initialize the checkout
  mercadopago.checkout({
    preference: {
      id: preferenceId
    },
    render: {
      container: '#button-checkout', // Class name where the payment button will be displayed
      label: 'Pagar ahora', // Change the payment button text (optional)
    }
  });
}

// Handle price update
function updatePrice() {
  let quantity = document.getElementById("quantity").value;
  let unitPrice = document.getElementById("unit-price").innerHTML;
  let amount = parseInt(unitPrice) * parseInt(quantity);

  document.getElementById("cart-total").innerHTML = "$ " + amount;
  document.getElementById("summary-price").innerHTML = "$ " + unitPrice;
  document.getElementById("summary-quantity").innerHTML = quantity;
  document.getElementById("summary-total").innerHTML = "$ " + amount;
}

document.getElementById("quantity").addEventListener("change", updatePrice);
updatePrice();

// Go back
document.getElementById("go-back").addEventListener("click", function () {
  $(".container_payment").fadeOut(500);
  setTimeout(() => {
    $(".shopping-cart").show(500).fadeIn();
  }, 500);
  $('#checkout-btn').attr("disabled", false);
});