import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title:       { type: String, required: true, unique: true},
        description: { type: String, required: true},
        price:       { type: Number, required: true, enum: [INR, USD]},
        image:       { type: }
    }
);
