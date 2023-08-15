"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCx = void 0;
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
const mongodb_1 = require("mongodb");
require("dotenv/config");
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;
const options = {};
const client = new mongodb_1.MongoClient(uri, options);
const clientPromise = client.connect();
const DATABASE = "bot";
const COLLECTIONS = {
    EVENTS: "events",
};
class mongoConnection {
    mongoClient;
    events;
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        this.events = this.mongoClient.then((client) => client.db(DATABASE).collection(COLLECTIONS.EVENTS));
    }
}
exports.MongoCx = new mongoConnection(clientPromise);
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
exports.default = clientPromise;
//# sourceMappingURL=mongodb.js.map