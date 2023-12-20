let cartId = 0;
let saveCart;
function updateCartList(products) {
  let cartContainer = document.getElementById('carrito');
  let cartContent = '';
  if (products.length === 0) {
    cartContent = '<p>No hay productos en el carrito</p>';
  } else {
    products.forEach((product) => {
      cartContent += `
    <div class="cart-item">
    <img src="${product.product.thumbnail}" class="cart-item-image">
    <div class="cart-item-details">
    <h5 class="cart-item-title">${product.product.title}</h5>
    <p class="cart-item-category">Categoría: ${product.product.category}</p>
    <p class="cart-item-id">ID: ${product.product._id}</p>
    <p class="cart-item-description">Descripción: ${product.product.description}</p>
    <p class="cart-item-price">$${product.product.price}</p>
    </div>
    <p class="cart-item-quantity">Cantidad: ${product.quantity}</p>
    <button data-cid="${cartId}" data-pid="${product.product._id}" class="remove-from-cart" onclick="removeProductFromCart('${cartId}', '${product.product._id}')">Eliminar</button>
    </div>
    `
        ;
    });
    cartContent += `<button class="finalize-purchase" onclick="finalizeCartPurchaser('${cartId}')">Finalizar Compra</button>`;
  }
  cartContainer.innerHTML = cartContent;
}


function showTicket(ticket) {
  let ticketContainer = document.getElementById('ticket');
  let ticketContent = '';
  if (ticket == null) {
    ticketContent = '<p></p>';
  } else {
    ticketContent += `
          <div class="ticket-details">
            <h5 class="ticket-title">PRECIO TOTAL DE LA COMPRA: ${ticket.amount}</h5>
            <h5 class="ticket-category">CODE DE REF. COMPRA: ${ticket.code}</h5>
            <h5 class="ticket-description" >HORA DE LA COMPRA: ${ticket.purchase_datetime}</h5>
            <h5 class="ticket-description">COMPRADOR:${ticket.purchaser}</h5>
          </div>  
            `
  }
  ticketContainer.innerHTML = ticketContent;
}

fetch('/api/carts/', {
  method: 'POST',
  body: JSON.stringify({ products: [] }),
  headers: {
    'Content-Type': 'application/json',
  },
}).then((result) => {
  result.json().then((data) => {
    cartId = data.cart._id;
  });
});

function addCart(id) {
  fetch(`/api/carts/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({
      pid: id,
      quantity: 1,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    result.json().then((data) => {
      updateCartList(data.cart.products);
      showTicket(data.ticket);
    });
  });
}

function removeProductFromCart(cid, pid) {
  const url = `/api/carts/${cid}/product/${pid}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          updateCartList(data.cart.products);
        })
      } else {
        throw new Error('No se pudo eliminar el producto del carrito');
      }
    })
    .then((data) => {
      const updatedCart = data.cart.products;
      console.log(updatedCart);
    })
    .catch((error) => {
      console.error(error);
    });
}


function finalizeCartPurchaser(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    result.json().then((data) => {
      if (data.message == 'Compra finalizada con éxito') {
        showTicket(data.result.ticket)
        updateCartList([])
        fetch('/api/carts/', {
          method: 'POST',
          body: JSON.stringify({ products: [] }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((result) => {
          result.json().then((data) => {
            cartId = data._id;
          });
        });
      } else {
        alert('ERROR')
      }
    })
  })
}