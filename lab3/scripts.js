var schmoDiv = document.getElementById("schmo marie");
//schmoDiv.hidden = true;
if(schmoDiv === null){

}
console.log(schmoDiv);

function ourDivWasClicked(){
    if(schmoDiv.innerHTML === "Hello"){
      schmoDiv.innerHTML = "howdy!";
    }else{
       schmoDiv.innerHTML = "Hello"
    }
    console.log("our function was called");
   
}


schmoDiv.onclick = ourDivWasClicked;