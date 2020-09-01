import Utils from '../services/utils.js';

let SolveCrossword = {
    render: () => {
        let tmp = '';
        for (var i = 0; i < 8; i++) {
            tmp += "<tr>";
            for (var j = 0; j < 10; j++) {
                if(i == 0 && j > 0){
                    tmp += '<td><input class=\"table_cell\" maxlength="1" readonly name="cell" value="' + j + '"></td>';
                } else if(j == 0 && i > 0){
                    let ch = '';
                    switch(i){
                        case 1: ch = 'A'; break;
                        case 2: ch = 'B'; break;
                        case 3: ch = 'C'; break;
                        case 4: ch = 'D'; break;
                        case 5: ch = 'E'; break;
                        case 6: ch = 'F'; break;
                        case 7: ch = 'G'; break;
                        case 8: ch = 'H'; break;
                    }
                    tmp += '<td><input class=\"table_cell\" maxlength="1" readonly name="cell" value="' + ch + '"></td>';
                }
                else if(i == 0 && j == 0){
                    tmp += '<td><input class=\"table_cell\" readonly maxlength="1" name="cell"></td>';
                }
                else{
                    tmp += '<td><input class=\"table_cell\" maxlength="1" name="cell"></td>';
                }
            }
            tmp += "</tr>";
        }
        return `
                <aside class="questions_panel questions_panel2">
                <h3 align="center" style="color: black">
                    Questions
                </h3>
                <hr>
                <div id="conditions_panel">
                
                </div>
                <hr>
                <div align="center" id="finish"><button>Finish</button></div>
            </aside>
            <article class="crossword solve_crossword">
                <table cellpadding="0px" cellpadding="0px">
                    ${tmp}
                </table>
            </article>
        `
    },

    afterRender: async () => {
        const questions = document.getElementById('conditions_panel');
        const finish = document.getElementById('finish');
        let request = Utils.parseRequestURL();
        const parsedID = request.id;
        let cells_inputs = document.getElementsByName('cell');
        let width = 10;
        let height = 8;

        db.ref('crosswords/').once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key;
                var data = childSnapshot.val();
                if(key == parsedID){
                    questions.innerHTML = `<p align="center"  class="conditions_panel" id="conditions_panel">
                        ` + data['questions'] +`
                    </p>`;
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

        finish.addEventListener('click', async e => {
            db.ref('crosswords/').once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var data = childSnapshot.val();
                    if(key == parsedID){
                        var questionsCount = 0;
                        var correctAnswers = 0;
                        var answers = data['answers'];
                        var isWord = false;
                        var word = [];
                        var start = -1;
                        for(var i = width; i < cells_inputs.length; i++) {
                            if(i % width != 0){
                                if((i % width == width - 1 || answers[i] == " ") && isWord){
                                    word.push(answers[i]);
                                    isWord = false;
                                    if(word.length > 2){
                                        //alert(word);
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
                        for(var column = 1; column < width; column++){
                            for(var row = 1; row < height; row++){
                                if(isWord && (row == height - 1 || answers[column + row * width] == " ")){
                                    word.push(answers[column + row * width]);
                                    isWord = false;
                                    if(word.length > 2){
                                        //alert(word);
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
                        if(questionsCount != 0){
                            db.ref('crosswords/' + parsedID + '/results/' + (auth.currentUser.email).split('@')[0]).set({
                                //user: auth.currentUser.email,
                                result: (correctAnswers * 100 / questionsCount) + '%',
                            });
                        }
                        return;
                    }
                });
            });
        });

    },
};

export default SolveCrossword;