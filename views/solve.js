import Utils from '../services/utils.js';
import Table from '../services/table.js'

let SolveCrossword = {

    render: () => {
        return `<aside class="questions_panel questions_panel2">
                <h3 align="center" style="color: black">
                    Questions
                </h3>
                <hr>
                <div id="conditions_panel"></div>
                <hr>
                <div align="center"><button id="finish">Finish</button></div>
            </aside>
            <article class="solve_crossword">
                <table cellpadding="0px" cellpadding="0px" id="table">
                    ${Table.renderTable(10, 8)}
                </table>
            </article>`
    },

    afterRender: async () => {
        const questions = document.getElementById('conditions_panel');
        const finish = document.getElementById('finish');
        const table = document.getElementById('table');
        let request = Utils.parseRequestURL();
        const parsedID = request.id;
        let cells_inputs = document.getElementsByName('cell');
        let width = 10;
        let height = 8;

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (!firebaseUser){
                window.location.hash = '/';
            }
        });

        db.ref('crosswords/').once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key;
                var data = childSnapshot.val();
                if(key == parsedID){
                    questions.innerHTML = `<p align="center" class="conditions_panel" id="conditions_panel">` + data['questions'] +`</p>`;
                    width = data['width'];
                    height = data['height'];
                    table.innerHTML = Table.renderTable(width, height);;
                    var answers = data['answers'];
                    for(var i = 0; i < cells_inputs.length; i++) {
                        if(answers[i] == " " && i > width && i % width != 0){
                            cells_inputs[i].setAttribute('disabled', 'disabled');
                        }
                    }
                    return;
                }
            });
        });

        function checkHorizontalWords(answers){
            var questionsCount = 0;
            var correctAnswers = 0;
            var isWord = false;
            var word = [];
            var start = -1;
            for(var i = width; i < cells_inputs.length; i++) {
                if(i % width != 0){
                    if((i % width == width - 1 || answers[i] == " ") && isWord){
                        word.push(answers[i]);
                        isWord = false;
                        if(word.length > 2){
                            questionsCount += 1;
                            var isCorrect = true;
                            for(var j = start; j < start + word.length - 1; j++){
                                if(word[j - start] != cells_inputs[j].value){
                                    isCorrect = false;
                                    break;
                                }
                            }
                            if(isCorrect){
                                correctAnswers += 1;
                            }
                        }
                        word = [];
                    }
                    else if(answers[i] != " "){
                        word.push(answers[i]);
                        if(!isWord){
                            isWord = true;
                            start = i;
                        }
                    }
                }
            }       
            return {correct : correctAnswers, count : questionsCount};   
        }

        function checkVerticalWords(answers){
            var questionsCount = 0;
            var correctAnswers = 0;
            var isWord = false;
            var word = [];
            var start = -1;
            for(var column = 1; column < width; column++){
                for(var row = 1; row < height; row++){
                    if(isWord && (row == height - 1 || answers[column + row * width] == " ")){
                        word.push(answers[column + row * width]);
                        isWord = false;
                        if(word.length > 2){
                            questionsCount += 1;
                            var isCorrect = true;
                            for(var j = 0; j < word.length - 1; j++){
                                if(word[j] != cells_inputs[start + j * width].value){
                                    isCorrect = false;
                                    break;
                                }
                            }
                            if(isCorrect){
                                correctAnswers += 1;
                            }
                        }
                        word = [];
                    }
                    else if(answers[column + row * width] != " "){
                        word.push(answers[column + row * width]);
                        if(!isWord){
                            isWord = true;
                            start = column + row * width;
                        }
                    }
                }
            }
            return {correct : correctAnswers, count : questionsCount}; 
        }

        finish.addEventListener('click', async e => {
            db.ref('crosswords/').once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var data = childSnapshot.val();
                    if(key == parsedID){
                        var answers = data['answers'];
                        var horizontalResults = checkHorizontalWords(answers);
                        var verticalResults = checkVerticalWords(answers);
                        var correctAnswers = horizontalResults.correct + verticalResults.correct;
                        var questionsCount = horizontalResults.count + verticalResults.count;
                        alert(correctAnswers + '/' + questionsCount);
                        if(questionsCount != 0){
                            db.ref('crosswords/' + parsedID + '/results/' + (auth.currentUser.email).split('@')[0]).set({
                                result: (correctAnswers * 100 / questionsCount) + '%',
                            });
                            alert('Your result is ' + result);
                        }
                        return;
                    }
                });
            });
        });
    },
};

export default SolveCrossword;