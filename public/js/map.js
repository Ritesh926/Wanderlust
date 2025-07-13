
    //   <script>
    //     let mapToken= '<%= process.env.MAP_TOKEN %>';
    //     mapboxgl.accessToken = mapToken;
    //     const map = new mapboxgl.Map({
    //       container: 'map',
    //       style: 'mapbox://styles/mapbox/streets-v11',
    //       center: [77.209, 28.613], // [longitude, latitude]
    //       zoom: 10
    //     }); 
        
    //   </script>


   
   
   
   
    // Check if mapContainer exists (avoids error on other pages)
const mapContainer = document.getElementById('map');
if (mapContainer) {
  const lat = parseFloat(mapContainer.dataset.lat);
  const lng = parseFloat(mapContainer.dataset.lng);

  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(mapContainer.dataset.title)
    .openPopup();
}
