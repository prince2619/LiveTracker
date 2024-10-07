const socket  = io(); // initilaisating the scokect this send connection request at backend.

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords; // get the cordinates.
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout: 5000,
        maximumAge:0,
    }
);
}

const map =L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenstreetMap",
}).addTo(map);

// creating empty ibject marker
const markers = {};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);

    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})

// const socket = io();
// let userName = null;

// document.getElementById("userNameForm").addEventListener("submit", function(e) {
//     e.preventDefault();
//     userName = document.getElementById("username").value;

//     // Emit the username to the server to check if it's unique
//     socket.emit("set-username", userName);
// });

// socket.on("name-taken", () => {
//     // Display error if name is already taken
//     document.getElementById("nameError").style.display = "block";
// });

// socket.on("name-accepted", () => {
//     // Hide name form, show map and start location tracking
//     document.getElementById("nameForm").style.display = "none";
//     document.getElementById("mapContainer").style.display = "block";

//     // Start location tracking if geolocation is available
//     if (navigator.geolocation) {
//         navigator.geolocation.watchPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             socket.emit("send-location", { username: userName, latitude, longitude });
//         }, (error) => {
//             console.error(error);
//         }, {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         });
//     }
// });

// // Leaflet map setup as before
// const map = L.map("map").setView([0, 0], 16);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "OpenStreetMap",
// }).addTo(map);

// const markers = {};

// socket.on("receive-location", (data) => {
//     const { username, latitude, longitude } = data;
//     map.setView([latitude, longitude]);
//     if (markers[username]) {
//         markers[username].setLatLng([latitude, longitude]);
//     } else {
//         markers[username] = L.marker([latitude, longitude]).addTo(map).bindPopup(username).openPopup();
//     }
// });

// socket.on("user-disconnected", (username) => {
//     if (markers[username]) {
//         map.removeLayer(markers[username]);
//         delete markers[username];
//     }
// });
