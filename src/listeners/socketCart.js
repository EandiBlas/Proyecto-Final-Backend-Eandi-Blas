import cartServices from '../services/cart.services.js';
import productServices from '../services/product.services.js'

const cm = new cartServices();
const pm = new productServices();

const socketCart = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log('client connected con ID:', socket.id);
    const carts = await cm.getCarts();
    socketServer.emit('enviodecarts', carts);

    socket.on('addCart', async (obj) => {
      if (!obj._id) {
        const product = await pm.getProduct(obj.products[0]._id);
        const newcart = { products: [product] };
        const newCarts = await cm.createCart(newcart);
        const carts = await cm.getCart(newCarts._id);
        socketServer.emit('enviodecarts', carts);
      } else {
        const product = await pm.getProduct(obj.products[0]._id);
        const cart = await cm.getCart(obj._id);
        const carts = await cm.addProductToCart(cart._id, product);
        socketServer.emit('enviodecarts', carts);
      }
    });

    socket.on('nuevousuario', (usuario) => {
      console.log('usuario', usuario);
      socket.broadcast.emit('broadcast', usuario);
    });
    socket.on('disconnect', () => {
      console.log(`Usuario con ID : ${socket.id} esta desconectado `);
    });
  });
};

export default socketCart;