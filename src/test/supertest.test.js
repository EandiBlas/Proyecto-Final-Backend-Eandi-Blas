import supertest from "supertest";
import chai from "chai";
import app from '../app.js';

const expect = chai.expect;
const request = supertest.agent(app)


describe('Carts endpoints', () => {

        
    it('Carrito creado con éxito', async () => {

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });

        const obj = {
            products: [],
        };

        const response = await request
        .post('/api/carts')
        .send(obj);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('cart');
    });


    it('Obtener todos los carritos', async () => {
        const response = await request.get('/api/carts/')
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });



    it('Obtener un carrito por el id', async () => {
        const cid = '6569fc6f07158c22343c15ea'
        const response = await request.get(`/api/carts/${cid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('cart');
    });



    it('Eliminar un producto dado del carrito', async () => {

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });


        const cid = '656a06c267351b1ce91f4b89'
        const pid = '6569e275b63e96359807892a'

        const response = await request.delete(`/api/carts/${cid}/product/${pid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('cart');
    });



    it('Eliminar todos los productos de un carrito', async () => {

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });

        const cid = '656a05d467351b1ce91f4b69'

        const response = await request.delete(`/api/carts/${cid}`)
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('cart');
    });


    it('Actualizar la cantidad de un producto específico del carrito', async () => {

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });


        const cid = '656a0c3cce6414b2cca49c31'
        const pid = '6569e275b63e96359807892a'

        const response = await request.put(`/api/carts/${cid}/products/${pid}`).send({ quantity: 1 });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('result')
    });



    it('Debería avanzar con el proceso de compra', async () => {

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });

        const cid = '656a05d467351b1ce91f4b69'

        const response = await request.get(`/api/carts/${cid}/purchase`);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message').that.equals('Compra finalizada con éxito');
    });



})


describe('Products endpoints', () => {

        
    it('POST - Created a product', async () => {
        
        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });
        
        const product = {
            "title": "Mouse G203 LogitechT",
            "description": "Precio Calidad",
            "price": 20,
            "stock": 24,
            "thumbnail": "urldelaimagen.png",
            "code": "MOUSELOGITECH",
            "category": "Tecnologia"
        };
        
        const response = await request.post('/api/products').send(product);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property("message").that.equals("Producto creado");
    });


    it('GET -- product list', async () => {
        const response = await request.get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').that.equals('Lista de productos obtenida');
    });

    it('GET -- product by ID', async () => {
        const pid = '65694ecd4eb46c410ba77cb5';
        const response = await request.get(`/api/products/${pid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('product');
    });

    it('PUT -- product change property', async () => {
        const pid = '65694ecd4eb46c410ba77cb5';
        const product = {
            price: 12500.99,
            stock: 150
        };

        await request.post("/api/auth/login").send({
            username: "Richard",
            password: "1234"
        });

        const response = await request.put(`/api/products/${pid}`).send(product);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message').that.equals('Producto actualizado');
    });

    it('Delete -- product deleted by ID', async () => {
        const pid = '6569bfacb286e59521b76fee';
        const response = await request.delete(`/api/products/${pid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message').that.equals('Producto Eliminado');
    });
})



describe('Users endpoints', () => {

    it('POST -- Register a new user', async () => {
        const userData = {
            first_name: 'FFF',
            last_name: 'SAFF',
            username: 'FS3FFS',
            email: 'kmFS@SSAF.com',
            age: 333,
            password: '1234',
        };

        const response = await request.post('/api/auth/register').send(userData);
        expect(response.status).to.equal(201);
    });

    it('POST -- Login', async () => {
        const userData = {
            username: 'esteban',
            password: '1234'
        };

        const response = await request.post('/api/auth/login').send(userData);
        expect(response.status).to.equal(200);
    });

    it('POST -- Change user role', async () => {
        const uid = 'esteban';
        const response = await request.post(`/api/auth/premium/${uid}`);
        expect(response.status).to.equal(200);
    });

})