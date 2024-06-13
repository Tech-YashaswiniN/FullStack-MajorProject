const mongoose = require("mongoose");

// const Schema = mongoose.Schema;
// const listeningSchema = Schema({

// })

const listeningSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        // type: String,
        // default: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1792&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1792&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,

        url: String,
        filename:String

    },
    // price:Number,
    // location:String,
    // country:String,
    price: {
        type: Number,
        min: 0,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

const Listing = mongoose.model("Listing", listeningSchema);

module.exports = Listing;