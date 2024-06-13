const Listing = require("../modules/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}

module.exports.renderNewForm = (req, res) => {
    // I am going to write this below code in middleware.js file 
    // if (!req.isAuthenticated()) {
    //     req.flash("error", "You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requesting for does not exit!");
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image={url,filename};

    newListing.geometry = response.body.features[0].geometry; //storing the geometry of the map


    let savedListing = await newListing.save();
    console.log(savedListing)
    req.flash("success", "new listing created!");
    // console.log(newListing)
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requesting for does not exit!");
        res.redirect("/listings");
    }
    let OriginaImageUrl = listing.image.url;
    OriginaImageUrl =     OriginaImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing, OriginaImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename; 
        listing.image =  {url,filename};
        await listing.save();
    }
    req.flash("success", "new listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}