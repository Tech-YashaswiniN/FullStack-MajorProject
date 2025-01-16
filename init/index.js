const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/listing.js");

ATLASDB_URL= "mongodb+srv://yashaswininanjappaji16:Yashaswini16@cluster0.ydog0pk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


main()
    .then((res) => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(ATLASDB_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, 
        owner: "666b30df9645db84a3ac1a19",
        geometry: {
            type: "Point", // Make sure the type is always "Point"
            coordinates: obj.geometry.coordinates // Ensure coordinates are provided in your data
        }
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();




