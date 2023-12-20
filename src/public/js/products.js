fetch('http://localhost:8080/api/products')
  .then((response) => response.json())
  .then((data) => {
    updateProductList(data.payload);
  })
  function updateProductList(products) {
    let div = document.getElementById('contenedor');

    let productos = '';
    products.forEach((product) => {
      productos += `
      <div class="card">
      <img src ="${product.thumbnail}" class="card-img-top imgshop">
      <h2 class="card-title mytitulo">${product.title}</h2>
      <p class="card-text mydescripcion">Categoria: ${product.category}</p>
      <p class="card-text mydescripcion">ID:${product._id}</p>
      <p class="card-text mydescripcion">code:${product.code}</p>
      <p class="card-text mydescripcion">Info: ${product.description}</p>
      <p class="card-text mydescripcion">STOCK:${product.stock}</p>
      <p class="card-text mydescripcion">Owner:${product.owner}</p>
      <p class="card-text mydescripcion">$${product.price}</p>
      <button class="btn mx-auto d-block mybutton" id="${product._id}" onclick="addCart('${product._id}')"> Añadir al carrito </button>
      </div>
      `;
    });


  div.innerHTML = productos;
}
