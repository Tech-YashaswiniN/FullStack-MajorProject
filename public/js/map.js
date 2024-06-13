// let mapToken = mapToken;
//         console.log(mapToken)


        // mapboxgl.accessToken = mapToken;
        // const map = new mapboxgl.Map({
        //     container: 'map', // container ID
        //     center: [77.2088, 28.6139], // starting position [lng, lat]
        //     zoom: 9 // starting zoom
        // });

        // console.log(coordinates)
            
        // const marker1 = new mapboxgl.Marker()
        // .setLngLat(coordinates) //Listing.geometry.coordinates
        // .addTo(map);

// Ensure mapToken and coordinates are defined before using them
// console.log(mapToken);


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(listing.geometry.coordinates) // Use the correct variable here
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
    .addTo(map);





