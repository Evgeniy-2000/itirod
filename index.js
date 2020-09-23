import Registration from './views/register.js';
import Autorization from './views/autorization.js';
import Constructor from './views/constructor.js';
import Error404 from './views/error404.js';
import Utils from './services/utils.js';
import Navbar from './views/navBar.js';
import ChooseCrossword from './views/ChooseCrossword.js';
import SolveCrossword from './views/solve.js';

let user = null;

const routes = {
    '/': Autorization,
    '/registration': Registration,
    '/construct': Constructor,
    '/choose': ChooseCrossword,
    '/solve/:id': SolveCrossword,
};

const router = async () => {
    const header = document.querySelector('header');
    const content = document.querySelector('main');
    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '');

    if(!(request.resource == '' || request.resource == 'registration')) {
        header.innerHTML = await Navbar.render();
        await Navbar.afterRender();
    }

    let page = routes[parsedURL] ? routes[parsedURL] : Error404;
    if (page == Constructor) {
        content.innerHTML = await page.render();
    }
    else{
        content.innerHTML = await page.render(); 
    }
    await page.afterRender();
}

window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            user = firebaseUser.email;
            window.location.hash = '/construct';
        } else {
            window.location.hash = '/';
        }
        router();
    });    
    
});