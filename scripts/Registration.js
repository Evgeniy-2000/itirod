/*function Registration(){
	var _name = document.getElementById('name').value;
	var _password = document.getElementById('password').value;
	var _confPassword = document.getElementById('confirmPassword').value;

	if(_name.length == 0){
		alert('Input name. please!')
	}
	else if(_password != _confPassword){
		alert('Incorrect password!');
	}
	else if(_password.length < 2){
		alert('Password have to consist from at least 8 symbols!');
	}
	else{
		var firebaseConfig = {
		    apiKey: "AIzaSyC1twuLONMtc9Bed3MfAtCP16Og8BFboC0",
		    authDomain: "final-b9d65.firebaseapp.com",
		    databaseURL: "https://final-b9d65.firebaseio.com",
		    projectId: "final-b9d65",
		    storageBucket: "final-b9d65.appspot.com",
		    messagingSenderId: "988687201947",
		    appId: "1:988687201947:web:09f596f76aa1ae2625f83e",
		    measurementId: "G-TGPZN8KH7B"
		};
	  	document.firebase.initializeApp(firebaseConfig);

		/*document.firebase.database().ref("Users").set({
		    name : _name,
		    age: 29,
		});
		document.firebase.database().ref().child('Users').push({
			name: _name,
			password: _password
		});
	}
}*/

