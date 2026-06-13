import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error ("please add MONGO_URI to .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;

    promise:
    | Promise<typeof mongoose>
    | null;
}

declare global {
    var mongooseCache:
    | MongooseCache
    | undefined;
}

const cached = global.mongooseCache || {
    conn: null,
    promise: null,
}

export default async function connectDB() {

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
        .connect(MONGO_URI)
        .then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    global.mongooseCache = cached;
    return cached.conn;
}