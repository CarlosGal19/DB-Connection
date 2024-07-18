import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/shop')
    .then(() => console.log('Connected to DB'))
    .catch((e) => console.log('Error', e));

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

const productInCartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    products: {
        type: [productInCartSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const CartModel = mongoose.model('Cart', cartSchema);

const orderSchema = new mongoose.Schema({
    shopping_cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'shipped', 'cancelled']
    },
    address: {
        type: String,
        required: true
    }
});

const OrderModel = mongoose.model('Order', orderSchema);

async function addProduct() {
    await ProductModel.create([
        {
            "name": "Coca Cola",
            "price": 17,
            "description": "600 ml",
            "amount": 55
        },
        {
            "name": "Pepsi",
            "price": 16,
            "description": "600 ml",
            "amount": 42
        },
        {
            "name": "Suavitel",
            "price": 32,
            "description": "1 L",
            "amount": 12
        }
    ]);
    console.log('Products added successfully');
}

async function addCart() {
    // Retrieve product IDs to use in cart creation
    const products = await ProductModel.find();
    const cartProducts = [
        { productId: products[0]._id, quantity: 3 },
        { productId: products[1]._id, quantity: 2 },
        { productId: products[2]._id, quantity: 8 }
    ];

    await CartModel.create({
        products: cartProducts,
        total: 2819
    });
    console.log('Cart added successfully');
}

async function addOrder() {
    const cart = await CartModel.findOne(); // Find the first cart added
    await OrderModel.create({
        shopping_cart_id: cart._id,
        status: "pending",
        address: "Av. Gerónimo de la Cueva"
    });
    console.log('Order added successfully');
}

addProduct()
    .then(() => addCart())
    .then(() => addOrder())
    .catch((error) => console.log('Error:', error));
