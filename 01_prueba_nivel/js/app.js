var cards={};
var option1="";
var option2="";
var element1="";
var element2="";
cards= new Array("picas","diamantes","picas","diamantes");


function setup(){      
      
         document.getElementById("card0").setAttribute("carta", cards[0]);
         document.getElementById("card1").setAttribute("carta", cards[1]);
         document.getElementById("card2").setAttribute("carta", cards[2]);
         document.getElementById("card3").setAttribute("carta", cards[3]);    
}

function game(element){    

    //compronar opcion seleccionada
    if(option1==""){   
        //asignar cara de la carta
       
        option1=document.getElementById(element).getAttribute("carta");
        document.getElementById(element).style.backgroundImage = "url('../css/img/"+option1+".png')";
        element1=element;

    }else{        
        option2=document.getElementById(element).getAttribute("carta");
        document.getElementById(element).style.backgroundImage = "url('../css/img/"+option2+".png')";
        element2=element;       
    }

    if((option1!="" && option2!="") && option1==option2){    
        option1="";
        option2="";
    }else if((option1!="" && option2!="") && option1!=option2){      
        option1="";
        option2="";        
        setTimeout(function(){ reverse() }, 1000);      
    }  
     
}
//funcion para volver las cartas selecionadas al reverso
function reverse(){
    document.getElementById(element2).style.backgroundImage = "url('../css/img/reverso.jpg')";
    document.getElementById(element1).style.backgroundImage = "url('../css/img/reverso.jpg')"
} 

//funcion para volver las cartas al reverso
function reset(){

    document.getElementById('card0').style.backgroundImage = "url('../css/img/reverso.jpg')";
    document.getElementById('card1').style.backgroundImage = "url('../css/img/reverso.jpg')";
    document.getElementById('card2').style.backgroundImage = "url('../css/img/reverso.jpg')";
    document.getElementById('card3').style.backgroundImage = "url('../css/img/reverso.jpg')";
}

window.onload = setup;