  // Initialize and add the map
  (function initMap() {
    // The location of Uluru
    var coursefinder = {
      lat: 53.338457,
      lng: -6.247939
    };
    // The map, centered at Uluru
    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 15,
        center: coursefinder
      });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({
      position: coursefinder,
      map: map
    });
  })();
