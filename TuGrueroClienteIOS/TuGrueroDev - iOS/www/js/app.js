/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/




var appVersion = "1.0.0";
var jqxhr = null; //Variable para envair consultas
var callInterval = "";

//var params = "";
var params = {
    "ID": "V",
    "Cedula": "",
    "Placa": "",
    "Seguro": "",
    "Asegurado": "SI",
    "Nombres": "",
    "Apellidos": "",
    "Marca": "",
    "Modelo": "",
    "Anio": "",
    "Color": "",
    "Clase": "",
    "Tipo": "N/A"
};
var solicitud = {
    "idPoliza": "",
    "latOrigen": "",
    "lngOrigen": "",
    "latDestino": "",
    "lngDestino": "",
    "Direccion": "",
    "DireccionEDO": "",
    "CellContacto": "",
    "EstadoOrigen": "",
    "EstadoDestino": "",
    "QueOcurre": "",
    "Neumaticos": "",
    "Situacion": "",
    "GruaType": "",
    "InfoAdicional": "",
    "Cedula": "",
    "Placa": "",
    "Seguro": "",
    "Asegurado": "SI",
    "Nombres": "",
    "Apellidos": "",
    "Marca": "",
    "Modelo": "",
    "Anio": "",
    "Color": "",
    "Clase": "",
    "Tipo": "N/A"
};
//Identificadores para desactivar botones de siguiente.
var nextBtn = {
	"#v_carga": "#btn-carga-next",
	"#sub_cat": "#btn-cat-next",
	"#cuneta": "#btn-cuneta-next",
	"#taxi": "#btn-taxi-next",
	"#encender": "#btn-encender-next",
	"#quetiene": "#btn-quetiene-next",
	"#choque": "#btn-choque-next",
	"#cauchos": "#btn-cauchos-next",
	"#cambiollanta": "#btn-cambiollanta-next",
	"#masdetalles": "#btn-masdetalles-next",
	"#detalles": "#btn-detalles-next",
	"#resumen": "#btn-solicitar"
};

var myNextBtn;
var misDatos;

var selBtn = null;
var selOpt = null;
var selCat = null;
var cauchos = ["0", "0", "0", "0"];
var navegacion = ['#datos_inicio'];
var mlatlng = ""; //GPS origen corregido
var carrolatlng = "";
var grualatlng = "";

var btnTermino;



//Administra la ventana de Adevertencia al inicio
function Advertencia(accion) {
        $('#thm_mp_cntnr').remove();
        $('#meli_device').remove();
	var mAccion = (accion === "open") ? function () {
		$("#popupEntrar").modal("show");
	} : function () {
		$("#popupEntrar").modal("hide");
		activate_page('#paginaApp');
                
	};
	mAccion();
}


function Sesion() {

	if (appVersion !== localStorage.appVersion) {
		localStorage.clear();
		console.log("BORRADO");
		localStorage.appVersion = appVersion;
	}

	switch (localStorage.Etapa) {

	case 'esperandoPorGrua':
		RetomarSolicitud();
		break;

	case 'trayecto':
		RemostrarServicio();
		break;

	case 'rating':
		RemostrarRating();
		break;
			
				case undefined:
			console.log("pp");
		break;
			
	default:
		activate_page('#paginaApp');

	}
}


//Asigna el tipo de ID al documento de identidad 
function cambiarId(id) {
	params.ID = id;
	$('#tipoID').html(id + " <span class=caret></span>");
}



function verificacion() {

	params.Cedula = params.ID + "-" + $('#cedula').val();
	params.Placa = $('#placa').val().toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
	params.Seguro = $('#seguro').val();

        //console.log(params.Asegurado);
        
        if(params.Asegurado == "SI"){
            var OK = cedulaCheck($('#cedula').val()) ? placaCheck(params.Placa, $('#placa').val()) ? seguroCheck(params.Seguro) ? preEnvio() : false : false : false;
  
        }else{
            var OK = cedulaCheck($('#cedula').val()) ? placaCheck(params.Placa, $('#placa').val())  ?  avanzarGeneric("#noasegurado") : false : false ;

        }
        
}
function verificacionNuevaPoliza() {
        params.Marca = $('#input-marca').val();
        //localStorage.misDatos.Marca = params.Marca;
        params.Modelo = $('#input-modelo').val();
        //localStorage.misDatos.Modelo = params.Modelo;
        params.Nombres = $('#input-nombres').val();
        params.Apellidos = $('#input-apellidos').val();
        params.Color = $('#input-color').val();
        params.Anio = $('#input-anio').val();
        params.Clase = $('#input-clase').val();
        //params.Tipo = $('#input-tipo').val();
    //console.log('crear poliza y luego efectuar el login');
    var OK = nombresCheck($('#input-nombres').val()) ? apellidosCheck($('#input-apellidos').val()) ? marcaCheck($('#input-marca').val()) ? modeloCheck($('#input-modelo').val()) ? anioCheck($('#input-anio').val()) ? colorCheck($('#input-color').val()) ?  avanzarGeneric("#sub_cat") : false : false : false : false : false : false;

        
}
function nombresCheck(nombres) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (nombres.length >= 3) ? (nombres.length <= 45) ? "OK": mNombres.Invalido : mNombres.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function apellidosCheck(apellidos) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (apellidos.length >= 3) ? (apellidos.length <= 45) ? "OK": mApellidos.Invalido : mApellidos.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function marcaCheck(marca) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (marca.length >= 3) ? "OK" : mMarca.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function modeloCheck(modelo) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (modelo.length >= 1) ? (modelo.length <= 25) ? "OK": mModelo.Invalido : mModelo.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function anioCheck(anio) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (anio.length >= 4) ? "OK" : mAnio.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function colorCheck(color) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (color.length >= 3) ? (color.length <= 20) ? "OK": mColor.Invalido : mColor.Vacio;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}
function cedulaCheck(cedula) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};

	parametros.mensaje = (cedula.indexOf('.') < 0) ? $.isNumeric(cedula) ? (cedula.length > 5) ? "OK" : mCedula.Corta : mCedula.Numerica : mCedula.Signo;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}



function placaCheck(placa, original) {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	parametros.mensaje = (placa !== "") ? (placa.length > 5) ? (placa.length === original.length) ? "OK" : mPlaca.Formato : mPlaca.Corta : mPlaca.Vacia;

	return (parametros.mensaje === "OK") ? true : genericPop(parametros);
}

function seguroCheck(seguro) {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Alto",
		"mensaje": "Debe seleccionar su empresa de SEGUROS para continuar.",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]

	};
	return (seguro !== "-") ? true : genericPop(parametros);
}

function genericPop(parametros) {

	var pop = document.getElementById(parametros.popup); //Venatana padre
	var imagen = pop.getElementsByTagName('img');
	imagen[0].src = "images/SVGs/" + parametros.imagen + ".svg";
	var mensaje = pop.getElementsByTagName('p');
	var botones = pop.getElementsByTagName('button'); //[0]interno,[1]aceptar,[2]cancelar,[2]Conitnuar
	var barra = pop.getElementsByClassName('progress');
	barra[0].style.display = parametros.displaybarra;
	hideShow(botones, parametros);
	mensaje[0].innerHTML = parametros.mensaje;

	if (!$("#" + parametros.popup).hasClass('in')) {
		$("#" + parametros.popup).modal("show");
	}

	$(imagen[0]).css('width', 'auto');
	$(imagen[0]).css('height', 'auto');
	$(imagen[0]).css('min-width', '100%');
	$(imagen[0]).css('min-height', '100%');

	//	$(imagen[0]).css('width', '209');
	//	$(imagen[0]).css('height', '85');

}

function closePops() {

	if ($("#popupInico").hasClass("in"))
		$("#popupInico").modal("hide");
	if ($("#pop-generic").hasClass("in"))
		$("#pop-generic").modal("hide");
	if ($("#pop-final").hasClass("in"))
		$("#pop-final").modal("hide");
}


function hideShow(elementos, parametros) {

	for (var i = 0; i < elementos.length; i++) {
		elementos[i].style.display = parametros.displaysBotones[i];
		elementos[i].setAttribute('onClick', parametros.onClick[i]);
		elementos[i].innerHTML = parametros.text[i];
	}
}

function preEnvio() {
	var parametros = {
		"popup": "popupInico",
		"imagen": "Logon",
		"mensaje": msn.PreEnvio,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'inline'],
		"text": ['', '', 'Cancelar', 'Continuar'],
		"onClick": ["", "", "closePops()", "enviarDatos()"]

	};
	genericPop(parametros);
}

function enviarDatos() {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Conectando",
		"mensaje": "Por favor espere mientras se completa la operación.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Abortar', ''],
		"onClick": ["", "", "Abortar()", ""]

	};
	genericPop(parametros);
	verificarDatos();
}

function verificarDatos() {

	AjaxCall("loginCliente.php", params, validarRespuesta, errorjQ);

}


function validarRespuesta(data) {
	//console.log(data);

	if (data.Error === undefined) {

		if (data.Fallo === undefined) {
			$("#popupInico").modal("hide");
			misDatos = data;
			localStorage.misDatos = JSON.stringify(misDatos); //Datos completos de la póliza.
			//console.log(JSON.parse(localStorage.misDatos).DireccionEDO);

			solicitud.idPoliza = data.idPoliza;
            solicitud.EstadoDestino = data.DireccionEDO;
			if (data.Tipo === "Pickup" || data.Tipo === "Camion") {
				avanzarGeneric("#v_carga");
			} else {
				avanzarGeneric("#sub_cat");
			}

		} else {
			var parametros = {
				"popup": "popupInico",
				"imagen": "Alerta",
				"mensaje": data.Fallo,
				"displaybarra": ['none'],
				"displaysBotones": ['none', 'none', 'inline', 'none'],
				"text": ['', '', 'Cerrar', ''],
				"onClick": ["", "", "closePops()", ""]
			};
			genericPop(parametros);
		}

	} else {
		var param = {
			"popup": "popupInico",
			"imagen": "Error",
			"mensaje": data.Error,
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'inline', 'none'],
			"text": ['', '', 'Cerrar', ''],
			"onClick": ["", "", "closePops()", ""]
		};
		genericPop(param);
	}
}



function errorjQ(error) {

	var parametros = {
		"popup": "popupInico",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'inline', 'none'],
		"text": ['', '', 'Cerrar', ''],
		"onClick": ["", "", "closePops()", ""]
	};

	genericPop(parametros);
}

function AjaxCall(URL, parametros, exito, fallo, extra) {
	console.log("NewAJAx");

	jqxhr = $.ajax({
		url: "http://tugruero.com/clienteapp/" + URL,
		type: "POST",
		data: JSON.stringify(parametros),
		dataType: "JSON",
		timeout: 20000,
	});

	jqxhr.done(function (data) {
		if (extra === undefined) {
			exito(data);
		} else {
			exito(data, extra);
		}
	});

	jqxhr.fail(function (jqXHR, textStatus) {
		if (textStatus !== "abort") {
			fallo(jqXHR);
		}
	});
}



function Abortar() {
	closePops();
	jqxhr.abort();
}

function Back() {
	//console.log(navegacion);
	navegacion.pop();
	//	console.log(navegacion);
	if ((navegacion[navegacion.length - 1] === '#datos_inicio') || (navegacion[navegacion.length - 1] === '#trayecto') || (navegacion[navegacion.length - 1] === '#rating')) {
		var backs = document.getElementsByName('btn-bck');
		for (var b = 0; b < backs.length; b++)
			$(backs[b]).css('display', 'none');
	}

	if (navegacion[navegacion.length - 1] === '#cauchos') resetMulti();
	//console.log(navegacion[navegacion.length - 1]);

	if (navegacion[navegacion.length - 1] === '#resumen') {
		$(termElem).removeClass('icon-seleccionado').addClass('icon-opcion');
		$('#btn-solicitar').attr('value', 'No');
		myNextBtn.attr('disabled', 'disabled');
	}

	avanzarGeneric(navegacion[navegacion.length - 1], false);
	//activate_subpage(navegacion[navegacion.length - 1]);
}


function BackGPS() {
	Back();
	closePops();
}




function llamarCallCenter() {
	window.location = "tel:05004783760";
}



function llamarGrua() {
	window.location = "tel:" + datos.Celular;
}



function selectCat(boton) {
	// console.log($(boton).attr('value'));

	if ($(selCat).hasClass("select"))
		habilitarCat(selCat);


	if (!$(boton).hasClass('select')) {
		$(boton).css('background-position', '-130px 0px');
		$(boton).addClass('select');
		myNextBtn.removeAttr('disabled');
		selCat = boton;
	}
}


function selectCat2(boton) {

	if ($(selCat).hasClass("Select"))
		habilitarCat(selCat);


	if (!$(boton).hasClass("Select")) {
		$(boton).attr('src', URL);
		$(boton).addClass('Select');
		selCat = boton;
		myNextBtn.removeAttr('disabled');
	}

}

function rollOver(boton) {

	var URL = $(boton).attr('url') + $(boton).attr('imagen') + 'OV.svg';
	if (!$(boton).hasClass("Select")) {
		$(boton).attr('src', URL);
	}
}

function habilitarCat(boton) {
	$(selCat).removeClass("select");
	restore(selCat);
}

function restore(boton) {
	//	console.log(boton);
	if (!$(boton).hasClass("select")) {
		$(boton).css('background-position', '');
	}
}


function resetBtn() {
	if (selBtn !== null) {
		$(selBtn).css("background-color", '');
		$(selBtn).css("color", '');
		selBtn = null;
	}
}

function seleccionar(boton) {

	if ($(boton).attr('Color') !== undefined) {
		$(boton).css('background-color', $(boton).attr('Color'));

	} else {
		$(boton).css('background-color', 'rgba(240,119,48,0.8)');
	}

	$(boton).css('color', 'rgba(0,0,0,0.8)');

	if (boton !== selBtn)
		resetBtn();

	selBtn = boton;
	myNextBtn.removeAttr('disabled');
}



function opcion(boton) {

	var elemento = boton.getElementsByTagName('i');

	if ($(elemento).hasClass('icon-opcion')) {
		$(elemento).removeClass('icon-opcion').addClass('icon-seleccionado');
		$(elemento).css('color', 'rgb(255,255,255)');
		resetOpt();
		selOpt = boton;
		myNextBtn.removeAttr('disabled');
	}
}



var multiop = [];

function multiopcion(boton) {

	var elemento = boton.getElementsByTagName('i');
	var selectd = $(elemento).hasClass('icon-rueda');
	var opcion = $(boton).val();
	var neumatico = $(boton).attr('caucho');

	if (selectd) {
		cauchos[opcion] = "0";
		$(elemento).removeClass('icon-rueda').addClass('icon-norueda');
		console.log(cauchos);
		if (cauchos[0] === "0" && cauchos[1] === "0" && cauchos[2] === "0" && cauchos[3] === "0")
			myNextBtn.attr('disabled', 'disabled');

		multiop[opcion] = null;

	} else {
		cauchos[opcion] = neumatico;
		$(elemento).addClass('icon-rueda').removeClass('icon-norueda');
		myNextBtn.removeAttr('disabled');
		multiop[opcion] = elemento;

	}

}



function resetMulti() {
	for (var i = 0; i < multiop.length; i++) {
		if (multiop[i] !== null) {
			$(multiop[i]).removeClass('icon-rueda').addClass('icon-norueda');
			cauchos[i] = "0";
		}
	}
	multiop = [];
}



function resetOpt() {
	if (selOpt !== null) {
		var elemento = selOpt.getElementsByTagName('i');
		$(elemento).removeClass('icon-seleccionado').addClass('icon-opcion');
		$(elemento).css('color', '');
	}

	selOpt = null;
}



function avanzarGeneric(subpagina, retroceder) {
        $('#thm_mp_cntnr').remove();
        $('#meli_device').remove();
        console.log("subpagina = "+subpagina);
	if ((subpagina === "#v_carga") || (subpagina === "#sub_cat") || (subpagina === "#comentarios") || (subpagina === "#noasegurado")) {
		var backs = document.getElementsByName('btn-bck');
		for (var b = 0; b < backs.length; b++)
			$(backs[b]).css('display', 'block');
	}
	//	if (myNextBtn) {
	//		myNextBtn.attr('disabled', 'disabled');
	//	}
	if (subpagina !== "#resumen") {
		//	console.log("D");
		myNextBtn = $(nextBtn[subpagina]);
		myNextBtn.attr('disabled', 'disabled');
	}


	//	console.log($(nextBtn[subpagina]), subpagina);
	closePops();
	resetBtn();
	resetOpt();
	habilitarCat(selCat);
	if (retroceder === undefined) {
		navegacion.push(subpagina);
	}
	activate_subpage(subpagina);

}



function siguienteCarga() {
	if (selBtn !== null) {
		if ($(selBtn).attr('value') === "si") {

			var parametros = {
				"popup": "popupInico",
				"imagen": "Alerta",
				"mensaje": msn.Carga,
				"displaybarra": ['none'],
				"displaysBotones": ['none', 'none', 'none', 'inline'],
				"text": ['', '', '', 'Aceptar'],
				"onClick": ["", "", "", "closePops()"]
			};

			genericPop(parametros);

		} else {
			avanzarGeneric('#sub_cat');
		}
	}
}


function siguienteCategorias() {
	if (selCat !== null) {
		parSolicitud.QueOcurre = $(selCat).attr('value');
		solicitud.QueOcurre = $(selCat).attr('value');
		var accion = (parSolicitud.QueOcurre === "Choqué") ? avanzarGeneric('#choque') : (parSolicitud.QueOcurre === "Encunetado") ? avanzarGeneric('#cuneta') : (parSolicitud.QueOcurre === "Neumático espichado") ? avanzarGeneric('#cauchos') : avanzarGeneric('#detalles');
	}
}


function siguienteChoque() {
	if (selBtn !== null) {
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Alto",
			"mensaje": "",
			"displaybarra": ['none'],
			"displaysBotones": ['none', 'none', 'none', 'inline'],
			"text": ['', '', '', ''],
			"onClick": ["", "", "", ""]
		};

		if ($(selBtn).attr('value') === "si") {
			parametros.mensaje = mChoque.Recuerde;
			parametros.displaysBotones = ['none', 'none', 'inline', 'inline'];
			parametros.text = ['', '', 'Cancelar', 'Continuar'];
			parametros.onClick = ["", "", "closePops()", "avanzarGeneric('#detalles')"];

		} else {
			parametros.mensaje = mChoque.Alerta;
			parametros.displaysBotones = ['none', 'none', 'none', 'inline'];
			parametros.text = ['', '', '', 'Aceptar'];
			parametros.onClick = ["", "", "", "closePops()"];
		}
		genericPop(parametros);
	}

}

////////////////////////////////////////////////////////////////

function holdchoque() {

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Alto",
		"mensaje": "En esta situación usted tiene que acudir a las autoridades de transito. Nuestros operadores de grúa no pueden asistir a vehículos que hayan tenido un accidente. Solicite una grúa a través de TU/GRUERO<sup>&reg;</sup> una vez que le autoricen que puede llevarse su vehículo.",
		"displaybarra": ['none'],
		"displaysBotones": ['inline', 'none', 'none', 'inline'],
		"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Aceptar'],
		"onClick": ["llamarCallCenter()", "", "", "closePops()"]
	};

	genericPop(parametros);
}

////////////////////////////////////////////////////////////////


function siguineteCuneta() {

	if (selOpt !== null) {
		if ($(selOpt).attr('value') === "mas") {

			var parametros = {
				"popup": "pop-generic",
				"imagen": "Alto",
				"mensaje": msn.Cuneta,
				"displaybarra": ['none'],
				"displaysBotones": ['inline', 'none', 'none', 'inline'],
				"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Aceptar'],
				//"idBotones": ["callCenter", "", "", ""],
				"onClick": ["llamarCallCenter()", "", "", "closePops()"]
			};

			genericPop(parametros);

		} else {
			//	avanzarGeneric('#taxi');
			avanzarGeneric('#detalles');

		}
	}
}



function siguienteTaxi() {

	if (selBtn !== null) {
		if ($(selBtn).attr('value') === "si") {
			var parametros = {
				"popup": "pop-generic",
				"imagen": "Callcenter",
				"mensaje": msn.Taxi,
				"displaybarra": ['none'],
				"displaysBotones": ['inline', 'none', 'none', 'inline'],
				"text": ['<i class="icon icon-llamar button-icon-left"></i>Call Center', '', '', 'Siguiente'],
				"onClick": ["llamarCallCenter()", "", "", "avanzarGeneric('#quetiene')"]
			};
			genericPop(parametros);

		} else {
			$('#callCenter').css('display', 'none');
			console.log("Pantalla de encendido elimana");
			avanzarGeneric('#quetiene');
		}
	}
}



function siguienteEncender() {
	if (selBtn !== null) {

		parSolicitud.Enciende = $(selBtn).attr('value');
		avanzarGeneric('#quetiene');
	}
}



function siguienteQuetiene() {
	if (selOpt !== null) {
		parSolicitud.QueTiene = $(selOpt).attr('value');
		var accion = (parSolicitud.QueTiene === "otra") ? avanzarGeneric('#otrafalla') : (parSolicitud.QueTiene === "neumaticos") ? avanzarGeneric('#cauchos') : avanzarGeneric('#detalles');
	}
}



function siguienteOtrafalla() {

	solicitud.OtraFalla = $('#otra_falla_texto').val();
	if (solicitud.OtraFalla !== "")
		avanzarGeneric('#detalles');
}



function siguineteCauchos() {
	var sinsel = 0;
	for (var i = 0; i < cauchos.length; i++) {
		if (cauchos[i] !== "0") {
			sinsel = 1;
			break;
		}

	}
	//	console.log(cauchos);
	if (sinsel !== 0) {
		//avanzarGeneric('#cambiollanta');
		avanzarGeneric('#detalles');
	}
}



function siguienteCambiollanta() {
	if (selBtn !== null) {
		parSolicitud.CambioLlanta = $(selBtn).attr('value');
		if (parSolicitud.CambioLlanta === "si") {
			avanzarGeneric('#masdetalles');
		} else {
			avanzarGeneric('#detalles');
		}

	}

}



function siguienteMasdetalles() {
	if (selOpt !== null) {
		parSolicitud.MasDetalles = $(selOpt).attr('value');
		avanzarGeneric('#detalles');
	}
}



function siguienteDetalles() {
	//console.log("het");

	if (selOpt !== null) {
		parSolicitud.DetallesImportante = $(selOpt).attr('value');
		solicitud.Situacion = $(selOpt).attr('value');
		var parametros = {
			"popup": "pop-generic",
			"imagen": "Conectando",
			"mensaje": "Buscando ubicación GPS, por favor espere mientras se ajusta la posición.",
			"displaybarra": ['Block'],
			"displaysBotones": ['none', 'none', 'none', 'none'],
			"text": ['', '', '', ''],
			"onClick": ["", "", "", ""]
		};

		encodeSolicitud();
		//avanzarGeneric('#origen');
		genericPop(parametros);
		callGPS();
	}
}



function enviarGPS() {

	solicitud.latOrigen = mapas.Origen.getCenter().lat();
	solicitud.lngOrigen = mapas.Origen.getCenter().lng();
	carrolatlng =  new google.maps.LatLng(solicitud.latOrigen, solicitud.lngOrigen);	
	mlatlng = new google.maps.LatLng(solicitud.latOrigen, solicitud.lngOrigen);
	reverseGeo(mlatlng);
	avanzarGeneric('#destino');
        //console.log("Origen" + mlatlng);

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Casa",
		"mensaje": msn.Estado,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};
	genericPop(parametros);
        //console.log(DireccionEDO);
	if(params.Asegurado == 'SI'){
            console.log("Asegurado si");
            $("#estado-input").replaceWith('<input class="wide-control form-control default" type="text" placeholder="..." id="estado-input" disabled="">');
            $('#estado-input').attr('placeholder', JSON.parse(localStorage.misDatos).DireccionEDO);

        }else{
            console.log("Asegurado no");
            $('#estado-input').removeAttr('disabled');
            $("#estado-input").replaceWith('<select id="estado-input" name="estado-input" class="wide-control form-control default input-lg">' +
                  '<option value="">--</option>' +
                  '<option value="Distrito Capital">Distrito Capital</option>' +
                  '<option value="Amazonas">Amazonas</option>' +
                  '<option value="Anzoátegui">Anzoátegui</option>' +
                  '<option value="Apure">Apure</option>' +
                  '<option value="Aragua">Aragua</option>' +
                  '<option value="Barinas">Barinas</option>' +
                  '<option value="Bolívar">Bolívar</option>' +
                  '<option value="Carabobo">Carabobo</option>' +
                  '<option value="Cojedes">Cojedes</option>' +
                  '<option value="Delta amacuro">Delta amacuro</option>' +
                  '<option value="Falcón">Falcón</option>' +
                  '<option value="Guárico">Guárico</option>' +
                  '<option value="Lara">Lara</option>' +
                  '<option value="Mérida">Mérida</option>' +
                  '<option value="Miranda">Miranda</option>' +
                  '<option value="Monagas">Monagas</option>' +
                  '<option value="Nueva esparta">Nueva esparta</option>' +
                  '<option value="Portuguesa">Portuguesa</option>' +
                  '<option value="Sucre">Sucre</option>' +
                  '<option value="Táchira">Táchira</option>' +
                  '<option value="Trujillo">Trujillo</option>' +
                  '<option value="Vargas">Vargas</option>' +
                  '<option value="Yaracuy">Yaracuy</option>' +
                  '<option value="Zulia">Zulia</option>' +
                '</select>');
  
        }
        
}



function siguienteDestino() {
        
        if(params.Asegurado == 'SI'){
            var OK = (checkInput('#input-ciudad')) ? (checkInput('#input-zona')) ? true  : inputIcompleto("Coloque su zona") : inputIcompleto("Coloque su ciudad");

        }
        
        if(params.Asegurado == 'NO'){
            var OK = (checkInput('#estado-input')) ? (checkInput('#input-ciudad')) ? (checkInput('#input-zona')) ? true  : inputIcompleto("Coloque su zona") : inputIcompleto("Coloque su ciudad"): inputIcompleto("Coloque su estado");

        }

	if (OK) {
            
                
		var mDir = "";
		if(params.Asegurado == 'SI'){
                    mDir = JSON.parse(localStorage.misDatos).DireccionEDO + ", ";
                    mDir += $('#input-ciudad').val() + ", ";
                    mDir += $('#input-zona').val();
                    solicitud.Direccion = mDir; 
                }else{
                    mDir = $('#estado-input').val() + ", ";
                    mDir += $('#input-ciudad').val() + ", ";
                    mDir += $('#input-zona').val();
                    solicitud.Direccion = mDir;
                }


		geocoderAddres(mDir);

		var parametros = {
			"popup": "pop-generic",
			"imagen": "Conectando",
			"mensaje": "Localizando dirección de destino, por favor espere.",
			"displaybarra": ['Block'],
			"displaysBotones": ['none', 'none', 'none', 'none'],
			"text": ['', '', '', ''],
			"onClick": ["", "", "", ""]
		};

		avanzarGeneric('#ajustar');
		genericPop(parametros);

	}

}



function checkInput(id) {
	var valor = $(id).val();
	return (valor !== "") ? (valor !== "-") ? true : false : false;
}



function inputIcompleto(extra) {
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Alerta",
		"mensaje": extra + ". Complete la información para continuar",
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	genericPop(parametros);

	return false;
}


function siguienteAjustar() {

	solicitud.latDestino = mapas.Destino.getCenter().lat();
	solicitud.lngDestino = mapas.Destino.getCenter().lng();
        
	mlatlng = new google.maps.LatLng(solicitud.latDestino, solicitud.lngDestino);
	reverseGeoDestino(mlatlng);
        
        if(params.Asegurado=='NO' ){
            //console.log('Entro en Asegurado = NO');
            getPrecio();
        }
            
        
        
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Casa",
		"mensaje": "Calculando coordenadas de su destino, por favor espere mientras se completa el proceso.",
		"displaybarra": ['block'],
		"displaysBotones": ['none', 'none', 'none', 'none'],
		"text": ['', '', '', ''],
		"onClick": ["", "", "", ""]
	};

	genericPop(parametros);

}


function ajusteDone() {

	closePops();
	localStorage.params = JSON.stringify(params);
	localStorage.parSolicitud = JSON.stringify(parSolicitud);
	avanzarGeneric('#resumen');
	var botones = document.getElementsByName('btn-add');
	$(botones[1]).addClass('collapsed');
	var textos = document.getElementById("reumen-textos").getElementsByTagName('p');
        textos[0].innerHTML = params.Cedula;
        textos[1].innerHTML = params.Placa;
        if(params.Asegurado == 'SI'){
            textos[2].innerHTML = misDatos.Marca;
            textos[3].innerHTML = misDatos.Modelo;
        }else{
            textos[2].innerHTML = params.Marca;
            textos[3].innerHTML = params.Modelo;
        }

	textos[4].innerHTML = parSolicitud.QueOcurre;
	textos[5].innerHTML = solicitud.Direccion;
	showResumen();

}

function ajusteError(mEstate) {
    if(params.Asegurado == 'SI'){
        var parametros = {
            "popup": "pop-generic",
            "imagen": "Alto",
            "mensaje": "La dirección de su destino (" + mEstate + ") tiene un Estado diferente al de su póliza (" + JSON.parse(localStorage.misDatos).DireccionEDO + "), por favor ajuste su destino antes de continuar.",
            "displaybarra": ['none'],
            "displaysBotones": ['none', 'none', 'none', 'inline'],
            "text": ['', '', '', 'Aceptar'],
            "onClick": ["", "", "", "closePops()"]
        };  
    }else{
        var parametros = {
            "popup": "pop-generic",
            "imagen": "Alto",
            "mensaje": "La dirección de su destino (" + mEstate + ") tiene un Estado diferente al de su póliza",
            "displaybarra": ['none'],
            "displaysBotones": ['none', 'none', 'none', 'inline'],
            "text": ['', '', '', 'Aceptar'],
            "onClick": ["", "", "", "closePops()"]
        };         
    }


	genericPop(parametros);

}


function showResumen() {
	var botones = document.getElementsByName('btn-add');

	for (var i = 0; i < botones.length; i++) {
		var padre = $(botones[i]).parents();
		var hijo = $(botones[i]).children();

		if (!$(botones[i]).hasClass('collapsed')) {
			$(padre[1]).removeClass('panel-default').addClass('panel-warning');
			hijo.removeClass('icon-mostrar').addClass('icon-ocultar');
		} else {
			$(padre[1]).removeClass('panel-warning').addClass('panel-default');
			hijo.removeClass('icon-ocultar').addClass('icon-mostrar');
		}
	}
}

function siguienteResumen(boton) {
    console.log('siguienteResumen');
	var cellphone = $('#cell-contacto').val();
	var terminos = $(boton).attr('value');
	solicitud.CellContacto = cellphone;
	solicitud.InfoAdicional = $('#comentarios-add').val();
        if(params.Asegurado == 'SI'){
            //hace la solicitud inmediatamente
            var OK = ($.isNumeric(cellphone)) ? (cellphone.indexOf('.') < 0) ? (cellphone.length === 11) ? (terminos === "Si") ? enviarSolicitud() : numeroInvalido(msn.AceptarCondiciones) : numeroInvalido(mNumero.Invalido) : numeroInvalido(mNumero.Signo) : (cellphone.length === 0) ? numeroInvalido(mNumero.Vacio) : numeroInvalido(mNumero.Letras);
                
        }else{
            //enviar a pantalla de mercadopago

                
            var OK = ($.isNumeric(cellphone)) ? (cellphone.indexOf('.') < 0) ? (cellphone.length === 11) ? (terminos === "Si") ? muestraMensajePrepago() : numeroInvalido(msn.AceptarCondiciones) : numeroInvalido(mNumero.Invalido) : numeroInvalido(mNumero.Signo) : (cellphone.length === 0) ? numeroInvalido(mNumero.Vacio) : numeroInvalido(mNumero.Letras);
                
        }


    
}

function muestraMensajePrepago (){
                avanzarGeneric('#mercadopago');
                var parametros = {
                        "popup": "pop-generic",
                        "imagen": "Tarjeta",
                        "mensaje": msn.GruaMP,
                        "displaybarra": ['none'],
                        "displaysBotones": ['none', 'none', 'none', 'inline'],
                        "text": ['', '', '', 'Aceptar'],
                        "onClick": ["", "", "", "closePops()"]
                };
                genericPop(parametros);
    
}

function numeroInvalido(extra) {

	var parametros = {
		"popup": "pop-generic",
		"imagen": "Stop",
		"mensaje": extra,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	genericPop(parametros);
}



var termElem;

function aceptarTerminos(boton) {

	var elemento = boton.getElementsByTagName('i');
	termElem = elemento;
	if ($(elemento).hasClass('icon-opcion')) {
		$(elemento).removeClass('icon-opcion').addClass('icon-seleccionado');
		$('#btn-solicitar').attr('value', 'Si');
		myNextBtn.removeAttr('disabled');

	} else {
		$(elemento).removeClass('icon-seleccionado').addClass('icon-opcion');
		$('#btn-solicitar').attr('value', 'No');
		myNextBtn.attr('disabled', 'disabled');

	}

}



function mostrarTerminos() {
	//	console.log(termElem);
	avanzarGeneric("#term_cat");
}



function resetApp() {
	closePops();
	jqxhr = null; //Variable para envair consultas
	callInterval = "";

	//var params = "";
	params = {
		"ID": "V",
		"Cedula": "",
		"Placa": "",
		"Seguro": ""
	};

	misDatos = null;
	myNextBtn = null;

	selBtn = null;
	selOpt = null;
	cauchos = ["0", "0", "0", "0"];
	navegacion = ['#datos_inicio'];
	localStorage.Etapa = undefined;
	mlatlng = ""; //GPS origen corregido
	grualatlng = "";


	solicitud = {
		"idPoliza": "",
		"latOrigen": "",
		"lngOrigen": "",
		"latDestino": "",
		"lngDestino": "",
		"Direccion": "",
		"CellContacto": "",
		"Parametros": "",
		"OtraFalla": "",
		"InfoAdicional": ""
	};

	$('#cedula').val("");
	$('#placa').val("");
	$('#seguro').val("-");
	$('#otra_falla_texto').val("");
	$('#input-estado').val("-");
	$('#input-ciudad').val("");
	$('#input-zona').val("");
	$('#cell-contacto').val("");
	$('#comentarios-add').val("");

	//Terminos reset
	$(termElem).removeClass('icon-seleccionado').addClass('icon-opcion');
	$('#btn-solicitar').attr('value', 'No');

	activate_subpage('#datos_inicio');
}



function forzarSalida() {
	localStorage.clear();
	navigator.app.exitApp();
}


function asegurado(){
    
    
        if($('#btn-asegurado').hasClass('btn-default')){
            $('#btn-asegurado').removeClass('btn-default').addClass('btn-success');
            $('#btn-noasegurado').removeClass('btn-success').addClass('btn-default');
            $('#div_seguro').show();
            params.Asegurado = "SI";
            //console.log(params.Asegurado);
        }else{
            //$('#btn-asegurado').removeClass('btn-success').addClass('btn-default');
           
        }

}
function noasegurado(){
        if($('#btn-noasegurado').hasClass('btn-default')){
            $('#btn-noasegurado').removeClass('btn-default').addClass('btn-success');
            $('#btn-asegurado').removeClass('btn-success').addClass('btn-default');
            $('#div_seguro').hide();
            params.Asegurado = "NO";
            //console.log(params.Asegurado);
        }else{
            //$('#btn-noasegurado').removeClass('btn-success').addClass('btn-default');
            
            
        }

}
/*
function inicar() {
	var myEl = document.getElementById("btn-entrar");
	myEl.addEventListener('click', function () {
		activate_page("#paginaApp");
	}, false);
}
*/
function anioPoliza(){
    var fecha = new Date();
    var i;
    var ano = fecha.getFullYear();
    for(i = ano; i >=(ano-50);i--){
        
        $('#input-anio').append("<option value='"+ i +"'>"+ i +"</option>");
    }
    
}
function ocultaTipo(){
    if($('#input-clase').val() == 'Moto'){
       $('#div-tipo').hide(); 
    }else{
        $('#div-tipo').show(); 
    }
}
function getPrecio() {

	
	AjaxCall("calculaPrecio.php", solicitud, validarPrecio, errorPrecio);

}
function validarPrecio(respuesta) {
	//console.log("aaaaaaaaaaaaa" + respuesta);
	if (respuesta.Precio !== 'null') {
		datos.Precio = respuesta.Precio;
                datos.PrecioFormateado = respuesta.PrecioFormateado;
                $('#precio-input').html("<b class='text-left'> Bs. " + datos.PrecioFormateado + "</b>");
                //$('#precio').val(datos.Precio);
		//console.log(datos.Precio);
                /*var parametros = {
                        "popup": "pop-generic",
                        "imagen": "Tarjeta",
                        "mensaje": "El monto a pagar es: " + datos.Precio + ", en la siguiente pantalla procederá a pagar.",
                        "displaybarra": ['none'],
                        "displaysBotones": ['none', 'none', 'none', 'inline'],
                        "text": ['', '', '', 'Aceptar'],
                        "onClick": ["", "", "", "closePops()"]
                };

                genericPop(parametros);*/

	}
}
function errorPrecio(error) {
	console.log(error);
	var parametros = {
		"popup": "pop-generic",
		"imagen": "Error",
		"mensaje": (error.readyState === 0) ? msn.ErrorConexion : error.statusText,
		"displaybarra": ['none'],
		"displaysBotones": ['none', 'none', 'none', 'inline'],
		"text": ['', '', '', 'Aceptar'],
		"onClick": ["", "", "", "closePops()"]
	};

	genericPop(parametros);
}