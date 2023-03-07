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

    client.close();
}

async function findProductsByBrand(brandName) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');
    const result = await collection.find({ brand: brandName }).toArray();
    
    console.log(`${result.length} products found for brand '${brandName}'`);
    console.log(result);
    
    client.close();
}

//insertProducts();
findProductsByBrand('Circle Sportswear');