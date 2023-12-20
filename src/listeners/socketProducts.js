import ProductManager from "../persistencia/dao/managers/productManagerMongo.js";
import ProductController from "../controllers/product.controller.js";

const pc = new ProductController()
const pm = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id)
        const listadeproductos = await pm.getProductsView()
        socketServer.emit("enviodeproducts", listadeproductos)

        socket.on("addProduct", async (product) => {
            await pc.addProduct(product)
            const listadeproductos = await pm.getProductsView()
            socketServer.emit("enviodeproducts", listadeproductos)
        })

        socket.on("deleteProduct", async (pid) => {
            console.log(pid)
            await pc.deleteProduct(pid)
            const listadeproductos = await pm.getProductsView()
            socketServer.emit("enviodeproducts", listadeproductos)
        })

        socket.on("nuevousuario", (usuario) => {
            socket.broadcast.emit("broadcast", usuario)
        })
        socket.on("disconnect", () => {
            console.log(`Usuario con ID : ${socket.id} esta desconectado `)
        })


    })
};

export default socketProducts;