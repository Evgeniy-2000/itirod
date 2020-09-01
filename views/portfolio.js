let Portfolio = {
    render: (all, user) => {
        Portfolio.all = all;
        Portfolio.user = user;
        return `
        <div class="crossword-list">${Portfolio.listItems(all)}</div>
        `
    },

    listItems: (all) => { 
        let markup= ``;
        for(let i in all[0]) {
            var color = false;
            if(all[0][i].procents.indexOf(1313) >= 0) {
                all[0][i].procents.splice(all[0][i].procents.indexOf(1313), 1);
            }
            let sum = all[0][i].procents ? all[0][i].procents.reduce(function(sum, current) {
                return sum + current;
              }, 0) : 0;
            if(all[0][i].author == Portfolio.user) {
                color = true;
            }
            let length = all[0][i].procents ? all[0][i].procents.length : 0;
            markup += Portfolio.renderItem(i, all[0][i].views, sum == 0 ? sum : (sum / length).toFixed(3), color);
        }
        return markup;
    },

    renderItem: (title, views, procents, color) => {
        return `
        <div class="crossword-item ${color}">
            <div class="item-title">
                <h3>${title}</h3>
                <div class="item-title-links">
                    <a href="#/solve/${title}">
                        <img src="img/watch-crossword.png">
                    </a>
                </div>
            </div>
            <p class="views">Количество решений</p>
            <p class="amount-views">${views}</p>
            <p class="procent">Процент выполнения</p>
            <p class="amount-procent">${procents}</p>
        </div>
        `
    },

    afterRender: () => {
        setTimeout(() => {
            const items = document.querySelectorAll('.crossword-item');
            items.forEach(item => {
                if(item.classList.value.includes('true')) {
                    item.childNodes[1].classList.add('mine');
                }
            });

            const mineItems = document.querySelectorAll('[class~="mine"]');
            mineItems.forEach(item => {
                let lnkAnswers = document.createElement('a');
                let imgAnswers = document.createElement('img');
                imgAnswers.setAttribute('src', 'img/answers.png')
                lnkAnswers.appendChild(imgAnswers);
                lnkAnswers.setAttribute('href', `#/answers/${item.childNodes[1].innerHTML}`);
                item.lastElementChild.append(lnkAnswers);
            });

        }, 2000);
        
    },

    all: [],
    user: null,


};

export default Portfolio;