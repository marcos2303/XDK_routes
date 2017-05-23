<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Directions service</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #floating-panel {
        position: absolute;
        top: 10px;
        left: 25%;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        text-align: center;
        font-family: 'Roboto','sans-serif';
        line-height: 30px;
        padding-left: 10px;
      }
    </style>
  </head>
  <body>
	  <input id="destination_lat" value="10.0821367">
	  <input id="destination_lon" value="-66.86511039733">
	  <input id="i" value="0">
	  
    <div id="map"></div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
		
        var directionsService;
        var directionsDisplay;
		var map;
		var i = 0;
      function initMap() {
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7																																																																																																																																																																																																																																																																																																																																	,
          center: {lat: 10.486799119147, lng: -66.86511039733}
        });
        directionsDisplay.setMap(map);
																									
			directionsService.route({
			  origin: '10.494816734766 , -66.91051483154',
			  destination: '10.486799119147 , -66.86511039733',
			  travelMode: 'DRIVING'
			}, function(response, status) {
			  if (status === 'OK') {
				directionsDisplay.setDirections(response);
			  } else {
				window.alert('Directions request failed due to ' + status);
			  }
			});

      }


	function renewMap() {
			  i = $('#i').val();
			  var destination_lat_new = (parseFloat($('#destination_lat').val()) * 1.0000000005);
			  var destination_lon_new = (parseFloat($('#destination_lon').val()) * 1.0000000005);
			  
			  $('#i').val(parseInt(i) + 1 );
			  $('#destination_lat').val(destination_lat_new);
			  $('#destination_lon').val(destination_lon_new);
			  
			  var str = destination_lat_new + ' , ' + destination_lon_new;
			  console.log(str);
			  origin = '10.494816734766 , -66.91051483154';
			  destination = '10.4805937 , -66.9036063';
			console.log('enviado');
        

			directionsService.route({
			  origin: origin,
			  destination: destination,
			  travelMode: 'DRIVING'
			}, function(response, status) {
			  if (status === 'OK') {
				directionsDisplay.setDirections(response);
			  } else {
				window.alert('Directions request failed due to ' + status);
			  }
			});

			//directionsDisplay.setMap(map);
	}

	
	 setInterval(function () {
        renewMap();
    },20000);
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFeSlIAjDg8U7zsWW82uJCNLi3IZxq9fI&callback=initMap">
		
    </script>
  </body>
</html>