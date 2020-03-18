/* eslint-disable */

//console.log('hello from the client side!');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VyZmluYmxvb2QiLCJhIjoiY2s3eGliZG81MGRlZjNtcG1wMjdleTNtZyJ9.Pns36jnRSp3GhrMTJbyE4g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/surfinblood/ck7xisftw1fkv1jno6gn7yxfy',
  scrollZoom: false
  //   center: [-118.113491, 34.111745],
  //   zoom: 10
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // create marker
  const el = document.createElement('div');
  el.className = 'marker';
  // add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //add a popup

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p> Day: ${loc.day}: ${loc.description} </p>`)
    .addTo(map);
  //extends the maps bounds of coordinates
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 200,
    right: 200
  }
});
