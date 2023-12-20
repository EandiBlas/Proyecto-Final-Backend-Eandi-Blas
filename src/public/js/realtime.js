const socketClient = io()


socketClient.on("enviodeproducts", (obj) => {
    updateProductList(obj)
})


function updateProductList(products) {
    let div = document.getElementById("contenedor");
    let productos = "";

    products.forEach((product) => {
        productos += `
        <div class="card">
            <img src ="${product.thumbnail}" class="card-img-top imgshop">
            <div>
                <h5 class="card-title mytitulo">${product.title}</h5>
                <p class="card-text mydescripcion">Categoria: ${product.category}</p>
                <p class="card-text mydescripcion">ID:${product._id}</p>
                <p class="card-text mydescripcion">Info: ${product.description}</p>
                <p class="card-text mydescripcion">$${product.price}</p>
                <buttton class="btn mx-auto d-block mybutton" id="#"><i class="fas fa-cart-plus"></i> Añadir al carrito </button>
            </div>
        </div>
          `;
    });

    div.innerHTML = productos;
}


let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;

    socketClient.emit("addProduct", {
        title,
        description,
        price,
        thumbnail,
        category,
        stock,
        code,
    });

    form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value;
    console.log(deleteid)
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
});