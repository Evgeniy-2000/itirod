import Utils from '../services/utils.js';
import Portfolio from './portfolio.js';

let Solver = {
    render: async () => {
        return `
        <div class="content">
                <div class="crossword-solver" id="crossword-solver">
                    <table>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>

                <div class="save">
                    <p>Введите id кроссворда, который необходимо загрузить для решения</p>
                    <input type="text" placeholder="id">
                    <div class="buttons-autorization">
                        <button id="load-btn">Загрузить</button>
                        <button id="check-btn">Проверить</button>
                    </div>
                </div>
            </div>
        `
    },

    renderTable: () => {
        let markup = ``;
        for(let i = 0; i < Solver.lenTR; i++) {
            markup += Solver.renderTR(i);
        }
        return `<div class="crossword-solver">
                    <table>
                        ${markup}
                    </table>
                </div>
    `
    },

    renderTR: (i) => {
        let markup = ``;
        for(let j = 0; j < Solver.lenTD; j++) {
            if(Solver.crossword[i][j].letter) {
                markup += Solver.renderTD(i, j);
            } else {
                markup += Solver.renderEmptyTD(i, j);
            }
            
        }
        return `
        <tr>${markup}</tr>
        `
    },

    renderTD: (i, j) => {
        return `
        <td id="${i}-${j}" class="not-empty">
            <input type="text" maxlength="1" onkeyup="this.value = this.value.toUpperCase();">
        </td>
        `
    },

    renderEmptyTD: (i, j) => {
        return `
        <td id="${i}-${j}"></td>
        `
    },

    renderQuestion: (quest) => {
        let questions = '';
        quest.forEach(q => {
            questions += q + '<br><br>';
        })
        return `
        <p class="my-question">Вопрос для данного поля:</p>
        <p class="text-question">${questions}</p>
        `
    },

    afterRender: async () => {
        const btnLoad = document.getElementById('load-btn');
        const idInput = document.querySelector('.save input');
        const btnCheck = document.getElementById('check-btn');
        
        let request = Utils.parseRequestURL();
        const parsedID = request.id;

        btnLoad.addEventListener('click', e => {
            const id = idInput.value;
            if(id) {
                Solver.clearAll();
                db.ref('crosswords/' + id).once('value', function(snapshot) {
                    if(snapshot.val() == null) {
                        alert('Кроссворда с таким id не существует!');
                    } else {
                        Solver.views = snapshot.val().views;
                        Solver.procents = snapshot.val().procents[0] != 1313 ? snapshot.val().procents : [];
                        Solver.answers = snapshot.val().answers ? snapshot.val().answers : [];
                        Solver.words = snapshot.val().words;
                        Solver.lenTR = snapshot.val().lenTR;
                        Solver.lenTD = snapshot.val().lenTD;
                        Solver.author = snapshot.val().author;
                        for(let i = 0; i < Solver.lenTR; i++) {
                            let row = [];
                            for(let j = 0; j < Solver.lenTD; j++) {
                                row.push({});
                            }
                            Solver.crossword.push(row);
                        }
                        for(let i=0; i < Solver.lenTR; i++) {
                            let row = [];
                            for(let j = 0; j <Solver.lenTD; j++) {
                                row.push(0);
                            }
                            Solver.currentAnswer.push(row);
                        }
                        for(let word of Solver.words) {
                            if(word.isVertical){
                                let count = 0;
                                for(let i = word.firstLetter[0]; i < word.firstLetter[0] + word.word.length; i++) {
                                    if(!Solver.crossword[i][word.firstLetter[1]].letter) {
                                        Solver.amountLetters++;
                                        Solver.crossword[i][word.firstLetter[1]] = {
                                            letter: word.word[count],
                                            question: []
                                        }
                                        Solver.crossword[i][word.firstLetter[1]].question.push(word.question);
                                    } else {
                                        Solver.crossword[i][word.firstLetter[1]].question.push(word.question);
                                    }
                                    count++;
                                }
                            } else {
                                let count = 0;
                                for(let i = word.firstLetter[1]; i < word.firstLetter[1] + word.word.length; i++) {
                                    if(!Solver.crossword[word.firstLetter[0]][i].letter) {
                                        Solver.amountLetters++;
                                        Solver.crossword[word.firstLetter[0]][i] = {
                                            letter: word.word[count],
                                            question: []
                                        }
                                        Solver.crossword[word.firstLetter[0]][i].question.push(word.question);
                                    } else {
                                        Solver.crossword[word.firstLetter[0]][i].question.push(word.question);
                                    }
                                    count++;
                                }
                            }
                        }
                        let newTable = document.createElement('div');
                        newTable.setAttribute('class', "crossword-solver");
                        newTable.setAttribute('id', "crossword-solver");
                        newTable.innerHTML = Solver.renderTable();
                        if(document.getElementById('crossword-solver')) {
                            document.getElementById('crossword-solver').replaceWith(newTable);
                        }
                        Solver.listenersForInput();
                    }
                });
            }
            
        })

        btnCheck.addEventListener('click', e => {
            e.preventDefault();
            let notEmpty = 0;
            let rightLetters = 0;
            for(let i = 0; i < Solver.lenTR; i++) {
                for(let j = 0; j < Solver.lenTD; j++) {
                    const myLetter = document.getElementById(i + '-' + j);
                    if(myLetter.childNodes[1] && myLetter.childNodes[1].value.length) {
                        notEmpty++;
                        Solver.currentAnswer[i][j] = myLetter.childNodes[1].value;
                    }
                    if(Solver.crossword[i][j].letter &&
                        Solver.crossword[i][j].letter == myLetter.childNodes[1].value) {
                        rightLetters++;
                    }
                }
            }
            if(Solver.crossword.length == 0) {
                alert("Кроссворд не загружен!");
            } else if(notEmpty < Solver.amountLetters) {
                alert("Для начала заполните все клеточки!");
            } else {
                for(let i = 0; i < Solver.lenTR; i++) {
                    for(let j = 0; j < Solver.lenTD; j++) {
                        const myLetter = document.getElementById(i + '-' + j);
                        if(Solver.crossword[i][j].letter &&
                            Solver.crossword[i][j].letter == myLetter.childNodes[1].value) {
                        } else if (Solver.crossword[i][j].letter) {
                            myLetter.classList.add('wrong');
                            myLetter.innerHTML = Solver.crossword[i][j].letter;
                        }
                    }
                }
                setTimeout(() => {
                    alert(`Правильность выполнения: ${(rightLetters / Solver.amountLetters * 100).toFixed(3)}%`);
                    Solver.procents.push(Number((rightLetters / Solver.amountLetters * 100).toFixed(3)));
                    Solver.answers.push(Solver.currentAnswer);
                    Solver.views += 1;
                    db.ref('crosswords/' + idInput.value).set({
                        words: Solver.words,
                        lenTD: Solver.lenTD,
                        lenTR: Solver.lenTR,
                        views: Solver.views,
                        procents: Solver.procents,
                        author: Solver.author,
                        answers: Solver.answers
                    })
                }, 10);
                setTimeout(() => {
                    window.location.hash = '/portf';
                }, 100);
            }
        });

        if(parsedID && parsedID != 0) {
            idInput.value = parsedID;
            btnLoad.click();
        }
    },

    listenersForInput: () => {
        const letters = document.querySelectorAll('.not-empty');

        var eventListener = function(e) {
            let questID = e.target.parentElement.id.split('-');
            let quest = Solver.crossword[questID[0]][questID[1]].question;
            let question = document.createElement('div');
            question.setAttribute('class', "definition");
            question.setAttribute('id', "definition");
            question.innerHTML = Solver.renderQuestion(quest);
            if(!document.getElementById('definition')) {
                document.getElementById('crossword-solver').after(question);
            } else {
                document.getElementById('definition').replaceWith(question);
            }

            for(let i = 0; i < Solver.lenTR; i++) {
                for(let j = 0; j < Solver.lenTD; j++) {
                    const myLetter = document.getElementById(i + '-' + j);
                    if(Solver.crossword[i][j].question && (
                        Solver.crossword[i][j].question.includes(quest[0]) ||
                        Solver.crossword[i][j].question.includes(quest[1]))) {
                        myLetter.classList.add("solve");
                    } else {
                        myLetter.classList.remove("solve");
                    }
                }
            }
        };

        letters.forEach(l => {
            l.addEventListener('keydown', eventListener);
            l.addEventListener('click', eventListener);
        });
    },

    clearAll: () => {
        Solver.lenTR = 0;
        Solver.lenTD = 0;
        Solver.words = [];
        Solver.crossword = [];
        Solver.amountLetters = 0;
        Solver.views = 0;
        Solver.procents = [];
        Solver.answers = [];
        Solver.currentAnswer = [];
    },

    lenTR: 0,
    lenTD: 0,
    words: [],
    crossword: [],
    amountLetters: 0, 
    views: 0,
    procents: [],
    answers: [],
    currentAnswer: [],
    author: null
};

export default Solver;