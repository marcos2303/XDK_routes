/**************************Errores en token************************/
    var array_errores_token = [];
    array_errores_token["205"] = "Ingresa el número de tu tarjeta.";
    array_errores_token["208"] = "Elige un mes.";
    array_errores_token["209"] = "Elige un año.";
    array_errores_token["212"] = "Ingresa tu documento de identidad.";
    array_errores_token["213"] = "Ingresa tu documento de identidad.";
    array_errores_token["214"] = "Ingresa tu documento de identidad.";
    array_errores_token["220"] = "Ingresa tu banco emisor.";
    array_errores_token["221"] = "Ingresa el nombre y apellido.";
    array_errores_token["224"] = "Ingresa el código de seguridad.";
    array_errores_token["E301"] = "Número de tarjeta inválido. Vuelve a ingresarlo.";
    array_errores_token["E302"] = "Revisa el código de seguridad.";
    array_errores_token["316"] = "Ingresa un nombre válido.";
    array_errores_token["322"] = "Revisa tu documento de identidad.";
    array_errores_token["323"] = "Revisa tu documento de identidad.";
    array_errores_token["324"] = "Revisa tu documento de identidad.";
    array_errores_token["325"] = "Revisa la fecha.";
    array_errores_token["326"] = "Revisa la fecha.";
    array_errores_token["default"] = "Revisa los datos.";
/******************Errores en el proceso **********************************/
    var array_errores_proceso = [];
    array_errores_proceso["106"] = "No puedes realizar pagos a usuarios de otros países.";
    array_errores_proceso["109"] = "Elige otra tarjeta u otro medio de pago";
    array_errores_proceso["126"] = "No pudimos procesar tu pago.";
    array_errores_proceso["129"] = "No procesa pagos del monto seleccionado. Elige otra tarjeta u otro medio de pago.";
    array_errores_proceso["145"] = "No pudimos procesar tu pago.";
    array_errores_proceso["150"] = "No puedes realizar pagos.";
    array_errores_proceso["151"] = "No puedes realizar pagos.";
    array_errores_proceso["160"] = "No puedes realizar pagos.";
    array_errores_proceso["204"] = "El tipo de pago no está disponible en este momento. Elige otra tarjeta u otro medio de pago.";
    array_errores_proceso["801"] = "Realizaste un pago similar hace instantes. Intenta nuevamente en unos minutos.";
    array_errores_proceso["default"] = "No pudimos procesar tu pago.";

/*******************Resultados del pago ***********************/
    var array_resultados = [];
    array_resultados["approved"] = [];
    array_resultados["in_process"] = [];
    array_resultados["rejected"] = [];

    array_resultados["approved"]["accredited"] = "¡Listo, se acreditó tu pago!. En tu resumen verás el cargo.";
    array_resultados["in_process"]["pending_contingency"] = "Estamos procesando el pago. En menos de una hora te enviaremos por e-mail el resultado.";
    array_resultados["in_process"]["pending_review_manual"] = "Estamos procesando el pago. En menos de 2 días hábiles te diremos por e-mail si se acreditó o si necesitamos más información.";
    array_resultados["rejected"]["cc_rejected_bad_filled_card_number"] = "Revisa el número de tarjeta.";
    array_resultados["rejected"]["cc_rejected_bad_filled_date"] = "Revisa la fecha de vencimiento.";
    array_resultados["rejected"]["cc_rejected_bad_filled_other"] = "Revisa los datos..";
    array_resultados["rejected"]["cc_rejected_bad_filled_security_code"] = "Revisa el código de seguridad.";
    array_resultados["rejected"]["cc_rejected_blacklist"] = "No pudimos procesar tu pago.";
    array_resultados["rejected"]["cc_rejected_call_for_authorize"] = "Debes autorizar ante el pago a MercadoPago";
    array_resultados["rejected"]["cc_rejected_card_disabled"] = "Llama a banco emisor para que active tu tarjeta. El teléfono está al dorso de tu tarjeta.";
    array_resultados["rejected"]["cc_rejected_card_error"] = "No pudimos procesar tu pago.";
    array_resultados["rejected"]["cc_rejected_duplicated_payment"] = "Ya hiciste un pago por ese valor. Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.";
    array_resultados["rejected"]["cc_rejected_high_risk"] = "Tu pago fue rechazado. Elige otro de los medios de pago, te recomendamos con medios en efectivo.";
    array_resultados["rejected"]["cc_rejected_insufficient_amount"] = "Tu medio de pago no tiene fondos suficientes.";
    array_resultados["rejected"]["cc_rejected_invalid_installments"] = "payment_method_id no procesa pagos en installments cuotas.";
    array_resultados["rejected"]["cc_rejected_max_attempts"] = "Llegaste al límite de intentos permitidos. Elige otra tarjeta u otro medio de pago.";
    array_resultados["rejected"]["cc_rejected_other_reason"] = "No proceso el pago";


Mercadopago.setPublishableKey("APP_USR-220b371a-4b3b-45af-9441-137e0e3d7732");

//Mercadopago.setPublishableKey("TEST-6d4e759f-3000-4816-bb77-45ce06df576e");
//Mercadopago.getIdentificationTypes();

$(document).ready(function(){

  //Mercadopago.getIdentificationTypes();

  

                        addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
                        addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);

                        doSubmit = false;
                        addEvent(document.querySelector('#pay'),'submit',doPay);
});


                        function addEvent(el, eventName, handler){
                            //console.log(el);
                            if (el.addEventListener) {
                                   el.addEventListener(eventName, handler);
                            } else {
                                el.attachEvent('on' + eventName, function(){
                                  handler.call(el);
                                });
                            }
                        };

                        function getBin() {
                            var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
                            return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
                        };

                        function guessingPaymentMethod(event) {
                            var bin = getBin();

                            if (event.type == "keyup") {
                                if (bin.length >= 6) {
                                    Mercadopago.getPaymentMethod({
                                        "bin": bin
                                    }, setPaymentMethodInfo);
                                }
                            } else {
                                setTimeout(function() {
                                    if (bin.length >= 6) {
                                        Mercadopago.getPaymentMethod({
                                            "bin": bin
                                        }, setPaymentMethodInfo);
                                    }
                                }, 100);
                            }
                        };

                        function setPaymentMethodInfo(status, response) {
                            if (status == 200) {
                                // do somethings ex: show logo of the payment method
                                var form = document.querySelector('#pay');

                                if (document.querySelector("input[name=paymentMethodId]") == null) {
                                    var paymentMethod = document.createElement('input');
                                    paymentMethod.setAttribute('name', "paymentMethodId");
                                    paymentMethod.setAttribute('id', "paymentMethodId");
                                    paymentMethod.setAttribute('type', "hidden");
                                    paymentMethod.setAttribute('value', response[0].id);

                                    form.appendChild(paymentMethod);
                                } else {
                                    document.querySelector("input[name=paymentMethodId]").value = response[0].id;
                                }
                            }
                        };

                        function doPay(event){
                            event.preventDefault();
                            var parametros = {
                            "popup": "pop-generic",
                            "imagen": "Tarjeta",
                            "mensaje": "Realizando pago espere un momento",
                            "displaybarra": ['block'],
                            "displaysBotones": ['none', 'none', 'none', 'none'],
                            "text": ['', '', '', ''],
                            "onClick": ["", "", "", ""]
                            };

                            genericPop(parametros);
                            if(!doSubmit){
                                var $form = document.querySelector('#pay');
                                Mercadopago.createToken($form, sdkResponseHandler); // The function "sdkResponseHandler" is defined below

                                return false;
                            }
                        };
                        function sdkResponseHandler(status, response) {
                            

                            if($('#email').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el correo electrónico</p>");
                                return false;
                            }
                            if($('#cardNumber').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Número de tarjeta</p>");
                                return false;
                            }
                            if($('#securityCode').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Código de seguridad</p>");
                                return false;
                            }
                            if($('#cardExpirationYear').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Año de vencimiento</p>");
                                return false;
                            }

                            if($('#cardExpirationMonth').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Mes de vencimiento</p>");
                                return false;
                            }
                            if($('#cardholderName').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Titular</p>");
                                return false;
                            }
                            if($('#docType').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Tipo de documento</p>");
                                return false;
                            }
                            if($('#docNumber').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Número de documento</p>");
                                return false;
                            }
                            if (status != 200 && status != 201) {
                                console.log("verify filled data");
                                console.log(status + response);
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique e intente nuevamente</p>");

                            }else{

                                
                                var form = document.querySelector('#pay');

                                var card = document.createElement('input');
                                card.setAttribute('name',"token");
                                card.setAttribute('id',"token");
                                card.setAttribute('type',"hidden");
                                card.setAttribute('value',response.id);
                                form.appendChild(card);
                                var datos = $( "#pay" ).serialize();
                                var token = $('#token').val();
                                var precio = $('#precio').val();
                                var descripcion = "Pago desde la APP";
                                var email = $('#email').val();
                                var paymentMethodId = $('#paymentMethodId').val();
                                //doSubmit=true;
                                $.ajax({
                                   url: "https://tugruero.com/mercadopago/pagoServicioApp.php?token="+token +"&paymentMethodId=" + paymentMethodId + "&precio=" + precio + "&email=" + email + "&descripcion=" + descripcion + "&Placa=" + params.Placa+ "&Nombres=" + params.Nombres+ "&Apellidos=" + params.Apellidos+ "&Clase=" + params.Clase+ "&Tipo=" + params.Tipo+ "&Marca=" + params.Marca+ "&Modelo=" + params.Modelo + "&Anio=" + params.Anio + "&Color=" + params.Color,
                                   data: response ,
                                   dataType: "json",
                                   error: function(response){
                                   },
                                   success: function(data){
                                        if (typeof data.error == 'undefined') { 
                                            var status = data.response["status"];
                                            //alert('no es undefined');
                                            console.log(data);
                                            if(status =='approved'){
                                                  
                                                console.log("idMp"+data.response["id"]);
                                                $('#idPagoMP').html("Número de comprobante de pago: " + data.response["id"]);
                                                $('.hide_mercadopago').hide();
                                                $('.show_mercadopago').show();
                                                //form.submit();
                                                var parametros = {
                                                "popup": "pop-generic",
                                                "imagen": "Check",
                                                "mensaje": "Pago efectuado satisfactoriamente.",
                                                "displaybarra": ['none'],
                                                "displaysBotones": ['none', 'none', 'none', 'inline'],
                                                "text": ['', '', '', 'Aceptar'],
                                                "onClick": ["", "", "", "closePops()"]
                                                };
                                                genericPop(parametros);
                                                    Mercadopago.clearSession();
                                                    $('#token').remove();

                                            }else{
                                                    muestraError("<p><h3>No fue aprobada la transacción</h3></p></p>Verifique e intente nuevamente</p>");
                                                    Mercadopago.clearSession();
                                                    $('#token').remove();
                                            }
                                        }else{
                                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique e intente nuevamente</p>");

                                        } 



                                       }
                                });


                                
                                
                            }
                        };
     
function muestraError(mensaje){
                            var parametros = {
                                "popup": "pop-generic",
                                "imagen": "Alto",
                                "mensaje": mensaje,
                                "displaybarra": ['none'],
                                "displaysBotones": ['none', 'none', 'inline', 'none'],
                                "text": ['', '', 'Cerrar', ''],
                                //"onClick": ["", "", "", "mostrarTaxi()"]
                                "onClick": ["", "", "closePops()", ""]

                        };
                        genericPop(parametros);
}
