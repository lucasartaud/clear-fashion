const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://lucas:123@cluster0.ihowrxt.mongodb.net/?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';

async function insertProducts() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    
    await db.collection('products').deleteMany({});

    const products = require('./products.json');
    
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    
    console.log(result);

    await client.close();
}

async function findProductsByBrand(brandName) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');
    const result = await collection.find({ brand: brandName }).toArray();
    
    console.log(`${result.length} products found for brand '${brandName}'`);
    console.log(result);
    
    await client.close();
}

async function findProductsMaximumPrice(maximumPrice) {
    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');
    
    const result = await collection.find({ price: { $lt: maximumPrice } }).toArray();
    
    console.log(`${result.length} products found for maximum price '${maximumPrice}'`);
    console.log(result);
    
    await client.close();
}

async function findProductsSortedByPrice(order) {
    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');
    
    const result = await collection.find().sort({ price: order }).toArray();
    
    console.log(`${result.length} products sorted by '${order}' (1 for ascending or -1 for descending order)`);
    console.log(result);
    
    await client.close();
}

async function main() {
    await insertProducts();
    findProductsByBrand('Circle Sportswear');
    findProductsMaximumPrice(30);
    findProductsSortedByPrice(1);
    findProductsSortedByPrice(-1);
}

main();