// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { Collection, MongoClient } from "mongodb";
import { CalendarEventNoID } from "../calendar/types";
import "dotenv/config";
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

const DATABASE = "bot";

const COLLECTIONS = {
  EVENTS: "events",
};

class mongoConnection {
  mongoClient: Promise<MongoClient>;

  events: Promise<Collection<CalendarEventNoID>>;

  constructor(mongoClient: Promise<MongoClient>) {
    this.mongoClient = mongoClient;

    this.events = this.mongoClient.then((client) =>
      client.db(DATABASE).collection<CalendarEventNoID>(COLLECTIONS.EVENTS)
    );
  }
}

export const MongoCx = new mongoConnection(clientPromise);
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
