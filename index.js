import Registration from './views/register.js';
import Autorization from './views/autorization.js';
import Constructor from './views/constructor.js';
import Portfolio from './views/portfolio.js';
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
    const all = [];
    const header = null || document.querySelector('header');
    const content = null || document.querySelector('main');
    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/') + 
        (request.id ? '/:id' : '');


    if(request.resource != '' || request.resource != 'registration') {
        header.innerHTML = await Navbar.render();
    }

    await Navbar.afterRender();

    let page = routes[parsedURL] ? routes[parsedURL] : Error404;
    if(page == Portfolio) {
        db.ref('crosswords').once('value', function(snapshot) {
            all.push(snapshot.val());
            content.innerHTML = page.render(all, user);
        });
        page.afterRender();
    } else if (page == Constructor) {
        content.innerHTML = await page.render(user);
        await page.afterRender();
    }
    else{
        content.innerHTML = await page.render(); 
        await page.afterRender();
    }
    

    /*if(request.resource == '' || request.resource == 'registration') {
        header.innerHTML = await Navbar.render([]);
    } else if(request.resource == 'construct') {
        header.innerHTML = await Navbar.render([{link: '#/portf', title: 'Портфолио'},
                                                {link: '#/solve/0', title: 'Решить'},
                                                {link: '#/', title: 'Выйти'}]);
    }
    await Navbar.afterRender();*/

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