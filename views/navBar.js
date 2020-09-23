let Navbar = {
    render: async linkArr => {
        return `
            <header class="top">
                <nav>
                    <a href="#/construct">My crosswords</a>
                    <a href="#/choose">Solve crossword</a>
                    <a href="#/" id="exit">Exit</a>
                </nav>
            </header>
        `;
    },

    afterRender: async () => {
        const btnLogOut = document.getElementById('exit');

        if(btnLogOut) {
            btnLogOut.addEventListener('click', () => {
                auth.signOut();
            })
        }
    }
};

export default Navbar;