import Constructor from './constructor.js';

let Registration = {
    render: async () => {
        return `
        <form class="start_forms_registration" id="reg_form">
		    <h1 align="center">Registration</h1>
		    <hr>
		    <input type="text" placeholder="name" id="name" class="reg_input"><br/>
		    <input type="password" placeholder="password" id="password" class="reg_input"><br/>
		    <input type="password" placeholder="password" id="confirmPassword" class="reg_input"><br/>
		    <button class="reg_button" id="reg_button">Registration</button>
	    </form>
        `;
    },
    
    afterRender: async () => {
        window.location.hash = '/registration';
        const btnReg = document.querySelector('#reg_button');
        const regForm = document.querySelector('#reg_form');
        let isSucs = true;
        regForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = regForm['name'].value;
            const password = regForm['password'].value;
            const confirmPassword = regForm['confirmPassword'].value;

            if (password != confirmPassword) {
                alert('Different passwords!');
            } else if (email == '' | password == '' | confirmPassword =='') {
                alert('Empty fields!');
            } else if(password.length < 8){
                alert('Password have to consist from at least 8 symbols!');
            } else {
                const promise = auth.createUserWithEmailAndPassword(email, password);
                promise.catch(e => {
                    alert(e.message);
                    isSucs = false;
                });
            }
            if (isSucs) {
                auth.onAuthStateChanged(firebaseUser => {
                    if(firebaseUser){
                      window.location.hash = '/construct';
                    }
                });
            }
        });

    }
};

export default Registration;