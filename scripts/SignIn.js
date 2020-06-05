

/*function SignIn(){
	var _name = document.getElementById('name').value;
	var _password = document.getElementById('password').value;

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

	  	//changing
	 	document.firebase.database().ref("User").set({
		    name : _name,
		    password: _password,
		});
		//getting
		firebase.database().ref('User').once('value').then(function(snapshot) {
  			var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
  			//alert(snapshot.val().name);
		});
		//adding
		firebase.database().ref().child('User').push({name:"Anna"});
};*/