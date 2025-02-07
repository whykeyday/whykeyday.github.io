var billy; // Declare a variable named billy

console.log(billy); // Output: undefined

billy = 13;
billy = 'billy is great';
billy = 'billy said "hello"';

//keyword expression codeblock
if (true){
    console.log(billy);
}
if(15 > 15){
    console.log('is it true?');
}

billy = "silly";
if(billy){ // coercion change string to a boolean
    console.log('billy is silly');
}

if(billy === 'silly'){
    console.log('really silly'); //===testing for equal value and same type
}

//==testing for equal value but allows for coercion
//billy == true
//billy gets coerced to a boolean and the expression is true

//tyepof operator precedes a variable name or literal value

console.log(typeof "hdththehe"); //string
console.log(typeof billy); 

if (typeof billy === 'string'){
    billy = 'dhtehsfg ihg';
}else{
    billy = 42;
}

////////////////////////
//for loop

for(var i = 0; i < 5; i++){
    console.log('hello');
}

for(var i = 0; i < 10; i++){
    console.log(i); 
}
console.log(i); //10

//function declaration
function bob(){
    console.log('i am bob');
    return 'bob';
}
//function invocation
bob(); // () function invokation operator,cannot have any spaces between the function name and the operator

for(var i = 0; i < 10; i++){
    bob();
}
/*

*/         //multi line comment

console.log(bob() ); //undefined
console.log(bob); //function definition

function bailly(data){
    console.log(data);
    return undefined;
}
bailly(50); //50

function bailly(data){
   data = data + 100;
   return data;
}
 var mydata = bailly(50);
 console.log(mydata); //150
 console.log( typeof mydata); //number


 recet(x,y,width,height)