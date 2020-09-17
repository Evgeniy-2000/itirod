import Registration from './register.js';
import Constructor from './constructor.js';

let Autorization = {
    render: async () => {
        return `
        <form class="start_forms" id="auth_form">
		<h1 align="center">Sign In</h1>
		<hr>
		<input type="text" placeholder="name" id="name" class="sign_in_input"><br/>
		<input type="password" placeholder="password" id="password" class="sign_in_input"><br/>
		<button class="sign_in_button">Sign In</button><br/>
		<a href="#/registration">Regitration</a>
	    </form>
        `;
    },
    
    afterRender: async () => {
        const authForm = document.querySelector('#auth_form');
        const main = document.querySelector('main');
        let isSucs = true;

        const goTo = async (e) => {
            e.preventDefault();
            main.innerHTML = await Registration.render();
            Registration.after_render();
        }

        authForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = authForm['name'].value;
            const password = authForm['password'].value;
            auth.signInWithEmailAndPassword(email, password).then(() => {
                auth.onAuthStateChanged(firebaseUser => {
                    if(firebaseUser){
                        window.location.hash = '/construct';
                    }
                });
            }).catch(e => {
                alert(e.message);
            });
        });

    }
};

export default Autorization;