console.log("initializing map box..");
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: cord, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});


const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(cord)
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML("<div class='mt-2'>You'll be here!</div>"))
    .addTo(map);

