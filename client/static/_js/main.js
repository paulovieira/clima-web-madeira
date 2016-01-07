window.Clima = window.Clima || {};

// simple polyfill for addEventListener (because it is not available in IE8) 
Clima.addEvent = function(evnt, elem, func) {
  if (elem.addEventListener){  // W3C DOM
    elem.addEventListener(evnt,func,false);
  }  
  else if (elem.attachEvent) { // IE DOM
    elem.attachEvent("on"+evnt, func);
  }
  else { // No much to do
    elem[evnt] = func;
  }
};


// NOTE: we add click handlers for buttons in the navbar because we cant use <a class='btn'>. More details here:
// http://getbootstrap.com/css/#buttons
// "While button classes can be used on <a> and <button> elements, only <button> elements are supported
//  within our nav and navbar components."



//  button from the navbar - login 

Clima.loginBtn = document.getElementById("js-login-nav");
if(!!Clima.loginBtn){
    Clima.addEvent("click", Clima.loginBtn, function(){
        window.location.href = "/" + Clima.lang + "/login";
    });
}

// button from the navbar - logout 

Clima.logoutBtn = document.getElementById("js-logout-nav");
if(!!Clima.logoutBtn){
    Clima.addEvent("click", Clima.logoutBtn, function(){
        window.location.href = "/" + Clima.lang + "/logout";
    });
}

// button from the navbar - dashboard 

Clima.dashboardBtn = document.getElementById("js-dashboard-nav");
if(!!Clima.dashboardBtn){
    Clima.addEvent("click", Clima.dashboardBtn, function(){
        window.location.href = "/" + Clima.lang + "/dashboard";
    });
}

// button from the navbar - lang 

Clima.langBtn = document.getElementById("js-lang-nav");
if(!!Clima.langBtn){
    Clima.addEvent("click", Clima.langBtn, function(){
        var currentPath = window.location.pathname.split("/");
        var newPath = "/" + (currentPath[1] === "pt" ? "en" : "pt");

        for(var i=2, l=currentPath.length; i<l; i++){
            newPath = newPath + "/" + currentPath[i];
        }
        window.location.href = newPath;
    });
}

// button from the navbar - contact

Clima.contactBtn = document.getElementById("js-contact-nav");
if(!!Clima.contactBtn){
    Clima.addEvent("click", Clima.contactBtn, function(){
        window.location.href = "mailto:drota.sra@gov-madeira.pt";
    });
}

// activate the bootstrap tooltips (top bar, login and lanaguage buttons) #}

// if($(document).width() > 710){
//     $('[data-toggle="tooltip"]').tooltip();
// }
  

// Bootstrap Notify plugin - http://bootstrap-notify.remabledesigns.com/
Clima.notify = function(type, msg, delay){

    var iconClass = (type === "danger" ? "fa fa-remove" : "fa fa-check-square-o");
    delay = delay || (type === "danger" ? 6000 : 1500);

    $.notify({
        icon: iconClass,
        message: msg,
    },{
        type: type,
        delay: delay,
        z_index: 1060
    });
};

Clima.getErrorMessage = function(err){

    var errMsg = err.responseJSON ? err.responseJSON.message : 
                 err.message      ? err.message : 
                 err.responseText ? err.responseText :
                 "unknown error";

    return errMsg;
}


$( document ).ready(function(){

  $("button.js-read-more").on("click", function(e){
    var $button = $(e.target);

    if(!$button.data("isOpen")){
      
      $button.data("isOpen", true);
      setTimeout(function(){

          $button.html('<i style="margin-right: 5px;" class="fa fa-arrow-circle-o-up"></i> Recolher');
      }, 200);
      
    }
    else{

     $button.data("isOpen", false);
      setTimeout(function(){

          $button.html('<i style="margin-right: 5px;" class="fa fa-arrow-circle-o-down"></i> Ler mais');   
      }, 200);
    }
    
    

    // <i class="fa fa-arrow-circle-o-down"></i>
  });


  Clima.mainContainerHeight = $("#main-container").outerHeight(true);
  Clima.mainContainerPaddingTop = parseInt($("#main-container").css("padding-top"), 10);
  Clima.mainContainerPaddingBottom = parseInt($("#main-container").css("padding-bottom"), 10);

  Clima.footerHeight = $(".footer").outerHeight(true);
  Clima.documentHeight = $(document).outerHeight(true);

  if(Clima.urlParam1 !== "dashboard" && Clima.urlParam1 !== "cartografia"){
  
    // manually adjust the height of main column (but not in the dashboard page)
    if(Clima.mainContainerHeight < Clima.documentHeight - Clima.footerHeight){

      //$("#main-container").height((Clima.documentHeight - Clima.footerHeight - Clima.mainContainerPaddingTop - Clima.mainContainerPaddingBottom ) + "px");
      $("#main-container").height((Clima.documentHeight -  Clima.mainContainerPaddingTop - Clima.mainContainerPaddingBottom ) + 50 + "px");
    }
  }

});



