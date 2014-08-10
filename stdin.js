process.stdin.once("data", function(data) {
	var response = data.toString();

	console.log("You said your name is " + response);

	process.stdin.pause(); 
});

console.log("What is your name?"); 

process.stdin.resume();