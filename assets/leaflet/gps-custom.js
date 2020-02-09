var map = new L.Map('mapid', {
  zoom: 17,
  center: new L.latLng([41.57573, 13.002411])
});

// let genLat, genLng;
map.addLayer(
  new L.TileLayer(
    'https://api.mapbox.com/styles/v1/horpey/ck68ctwxv02oa1incg8s1rc9d/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaG9ycGV5IiwiYSI6ImNqZXNrOHgweDN3ZHgycW1lNGd0MzY2NG8ifQ.iE72uu46mll2LzAIP2KRQA',
    {
      attribution: '',
      maxZoom: 32,
      id: 'mapbox/streets-v11',
      accessToken: 'your.mapbox.access.token'
    }
  )
); //base layer

var gps = new L.Control.Gps({
  autoActive: true,
  autoCenter: true
}); //inizialize control

gps
  .on('gps:located', function(e) {
    //	e.marker.bindPopup(e.latlng.toString()).openPopup()
    console.log(e.latlng, map.getCenter());
    let userLoc = e.latlng;

    var customUser = L.icon({
      iconUrl: '../assets/img/tyler/avatar.png',
      shadowUrl: '../assets/img/tyler/pointer.svg',
      iconSize: [50, 50], // size of the icon
      iconAnchor: [24, 35], // the same for the shadow
      shadowSize: [30, 40], // size of the shadow
      shadowAnchor: [14, 0], // the same for the shadow
      popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });

    let genLat = userLoc.lat;
    let genLng = userLoc.lng;
    L.marker([userLoc.lat, userLoc.lng], { icon: customUser })
      .addTo(map)
      .bindPopup(
        'Hi, I am Custom User with Cordinate ' + userLoc.lat + ' ' + userLoc.lng
      );

    // New USer
    var customUser2 = L.icon({
      iconUrl: '../assets/img/tyler/randomuser.png',
      shadowUrl: '../assets/img/tyler/pointer.svg',
      iconSize: [50, 50], // size of the icon
      iconAnchor: [24, 35], // the same for the shadow
      shadowSize: [30, 40], // size of the shadow
      shadowAnchor: [14, 0], // the same for the shadow
      popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });

    // Marker Drop
    var marker = new L.marker([6.55490399999999, 3.3673607], {
      icon: customUser2,
      draggable: true
    }).addTo(map);

    var circle = L.circle([genLat, genLng], {
      color: '#72235901',
      fillColor: '#DB4377',
      fillOpacity: 0.3,
      radius: 100
    }).addTo(map);

    //TEsting If Inside
    var d = map.distance(marker.getLatLng(), circle.getLatLng());
    var isInside = d < circle.getRadius();
    circle.setStyle({
      fillColor: isInside ? '#FFD6E4' : '#DB4377'
    });

    //Even Drag If Inside
    marker.on('dragend', function(e) {
      var d = map.distance(e.target._latlng, circle.getLatLng());

      var isInside = d < circle.getRadius();
      if (isInside) {
        circle.setStyle({ fillColor: 'green' });
        toastr.success('User is within the Fence', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-center'
        });
        beep();
      } else {
        circle.setStyle({ fillColor: '#DB4377' });
        toastr.error('User is Outside the Fence', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-center'
        });
        beep();
      }
    });
  })
  .on('gps:disabled', function(e) {
    e.marker.closePopup();
  });

// EDIT ToolBAR
// FeatureGroup is to store editable layers
// add leaflet-geoman controls with some options to the map
map.pm.addControls({
  position: 'topright',
  drawMarker: false,
  drawCircleMarker: false,
  drawPolyline: false,
  drawRectangle: false,
  drawCircle: false,
  editMode: false,
  dragMode: false,
  cutPolygon: false
});

// Listen To Draw Event
map.on('pm:drawstart', ({ workingLayer }) => {
  workingLayer.on('pm:vertexadded', e => {
    console.log(e.target._latlngs);
  });
});

// Customize Line
// optional options for line style during draw. These are the defaults
var options = {
  // the lines between coordinates/markers
  templineStyle: {
    color: '#722459'
  },

  // the line from the last marker to the mouse cursor
  hintlineStyle: {
    color: '#722459',
    dashArray: [5, 5]
  }
};

// enable drawing mode for shape - e.g. Poly, Line, Circle, etc
// map.pm.enableDraw('Polygon', options);

map.pm.setPathOptions({
  color: '#722459',
  fillColor: '#FFD6E4',
  fillOpacity: 0.4
});

gps.addTo(map);

// BEep SOund
function beep() {
  window.navigator.vibrate([500, 200, 500]);
}
