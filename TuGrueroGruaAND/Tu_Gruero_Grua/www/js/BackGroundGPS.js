/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

/*
function iniciarNormal() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}


function OnSuccess(position) {
    console.log(position.coords.latitude, position.coords.longitude);
}

function OnError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}
*/

function StartGPS(show) {
    //console.log("start gps");
	if (navigator.geolocation) {

		var MSN = (show) ? yesMSN : noMSN;
        
		navigator.geolocation.getCurrentPosition(MSN, failME, {
			maximumAge: 0,
			timeout: 30000,
			enableHighAccuracy: true
		});
	} else {
		failME("error");
	}
}



function ReStartGPS() {
	//closePops();
	StartGPS();
	var parametros = {
		"popup": "popupInico",
		"imagen": "Asistir",
		"mensaje": "Obteniendo parámetros del GPS, por favor espere.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]

	};
	//genericPop(parametros);

}



function CancelGPS() {
	closePops();
	PreSelect("NO");
	Disponible("NO");
}

function failME(error) {
	console.log(error);
	//alert(error);
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "Para continuar debe activar su disposivito GPS en modo ahorro de batería o alta precición.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', '', 'Cancelar', 'Reintentar'],
		"onClick": ["", "", "CancelGPS()", "ReStartGPS()"]

	};
	//genericPop(parametros);
    $("#btn-gps").attr('class', 'alert alert-danger');
    GPSNo();
}


function noMSN(data) {
	StartME(data, false)
}

function yesMSN(data) {
	//GPS(data.coords);
	StartME(data, true);
}


function StartME(data, show) {
	console.log("STarMe");
    /*
    {
    "latitude": "10.495974987992",
    "longitude": "-66.91963518107"
    }
    */
	//alert(data.coords.latitude);
	var callbackFn = function (location) {
		console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
		gruaParam.Lat = location.latitude;
		gruaParam.Lng = location.longitude;
		GPS(location);
		backgroundGeoLocation.finish();
	};

	var failureFn = function (error) {
        $("#btn-gps").attr('class', 'alert alert-danger');
        GPSNo();
		//alert("Ha ocurrido un error al activando el GPS por favor vuelva a intertar");
		// console.log('BackgroundGeoLocation error');
	};

	// BackgroundGeoLocation is highly configurable. See platform specific configuration options
	backgroundGeoLocation.configure(callbackFn, failureFn, {
		desiredAccuracy: 10,
		stationaryRadius: 10,
		distanceFilter: 10,
		notificationTitle: "TU/GRUERO®",
		notificationText: "ABRIR",
		notificationIcon: 'icon',
		debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
		stopOnTerminate: true, // <-- enable this to clear background location settings when the app terminates
	});

	// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
	backgroundGeoLocation.start();

	var parametros = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": msn.ready,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Continuar'],
		"onClick": ["", "", "", "closePops()"]

	};


	if (show) {
        if(btnDisponible == "SI"){
            GPSSi();
            $("#btn-gps").attr('class', 'alert alert-success');
        }
        
		//genericPop(parametros);

	} else if (flag) {
		//closePops();
	} else {
		flag = true;
	}
}



function StopGPS() {
	backgroundGeoLocation.stop();
}




function GPS(data) {
    
    //console.log("actualiza el web service ");
	var mURL = "http://tugruero.com/grueroapp/gpsGrua.php";
	gruaParam.Lat = data.latitude;
	gruaParam.Lng = data.longitude;
	localStorage['gruaParam'] = JSON.stringify(gruaParam);

	var params = {
		"idGrua": gruaParam.idGrua,
		"Lat": data.latitude,
		"Lng": data.longitude,
        "GPSOn": "SI"
	};
	/*	if (jqxhr !== null) {
			jqxhr.abort();
			jqxhr = null;
		}*/
	//$.post(mURL, JSON.stringify(params));
    $.post( mURL, JSON.stringify(params))
      .done(function( data ) {
            
            $("#btn-gps").attr('class', 'alert alert-success');
      });
    
}
function GPSNo(){
	var mURL = "http://tugruero.com/grueroapp/gpsGrua.php";
    console.log("GPSNO");
   
    
	localStorage['gruaParam'] = JSON.stringify(gruaParam);
    
	var params = {
		"idGrua": gruaParam.idGrua,
        "GPSOn": "NO"
	};
    $.post( mURL, JSON.stringify(params))
      .done(function( data ) {
            StopGPS();
            $("#btn-gps").attr('class', 'alert alert-danger');
      });
    
    
}
function GPSSi(){
	var mURL = "http://tugruero.com/grueroapp/gpsGrua.php";
    console.log("GPSSi");
   
    
	localStorage['gruaParam'] = JSON.stringify(gruaParam);
    
	var params = {
		"idGrua": gruaParam.idGrua,
        "GPSOn": "SI"
	};
    $.post( mURL, JSON.stringify(params))
      .done(function( data ) {
            $("#btn-gps").attr('class', 'alert alert-success');
      });
    
    
}
function iniciarBack() {


	var callbackFn = function (location) {
		console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
		//$('#consola').text('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);

		//GPS(location);
		// Do your HTTP request here to POST location to your server.
		// jQuery.post(url, JSON.stringify(location));

		/*
		IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
		and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
		IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
		*/
		//backgroundGeoLocation.finish();
	};

	var failureFn = function (error) {
		console.log('BackgroundGeoLocation error');
	};

	// BackgroundGeoLocation is highly configurable. See platform specific configuration options
	backgroundGeoLocation.configure(callbackFn, failureFn, {
		desiredAccuracy: 10,
		stationaryRadius: 10,
		distanceFilter: 10,
		debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
		stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
	});

	// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
	backgroundGeoLocation.start();
	//$('#consola').text("GPS en background: iniciado.");

}