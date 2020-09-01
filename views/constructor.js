let Constructor = {
    tmp2: "",
    render: async (user) => {
        Constructor.rows = 8;
        Constructor.columns = 10;
        Constructor.user = user;
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
                    <aside class="questions_panel">
                    <div align="center">
                    <h2>
                        Questions
                    </h2>
                    <hr>
                        <textarea placeholder="please, write your q-s in format 'c3-c8:question'" class="tasks_field" id="questions_entry"></textarea>
                    </div>
                    <hr>
                    <div align="center">
                        <input placeholder="Name" class="entry" id="name_entry" maxlength="6">
                        <input placeholder="Id" class="entry" id="id_entry" maxlength="6">
                    </div>
                    <div align="center" class="questions_interaction">
                        <button id="save_button">Save</button>
                    </div>
                </aside>
                <aside class="users_crosswords">
                    <h3 align="center">
                        My crosswords
                    </h3>
                    <hr>
                    <div id="qqq"></div>
                    <hr>
                    <div align="center">
                        <input id="inp_num" placeholder="input number" maxlength="3" class="inp_ord_num">
                        <button id="Change">Change</button>
                        <button id="Delete">Delete</button>
                        <button id="Create">New</button>
                    </div>
                </aside>
                <article align="center" class="crossword">
                    <table cellpadding="0px" cellpadding="0px">
                        ${tmp}
                    </table>
                </article>

        `;
    },

    rows: 8,  
    columns: 10,  

    afterRender: async () => {
        const save = document.getElementById('save_button');
        const id_field = document.getElementById('id_entry');
        const name_field = document.getElementById('name_entry');
        const questions_field = document.getElementById('questions_entry');

        const Change = document.getElementById('Change');
        const Delete = document.getElementById('Delete');
        const Create = document.getElementById('Create');
        const inp_num = document.getElementById('inp_num');

        
        db.ref('crosswords/').on('value', function(snapshot){
            var keys = [];
            let counter = 0;
            snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key;
                var data = childSnapshot.val();
                if(data['author'] == auth.currentUser.email){
                    counter++;
                    document.getElementById("qqq").innerHTML += '<button>' + counter + '. ' + data['name'] + '</button>';
                    keys.push(key);
                }
            });
        });

        
        Change.addEventListener('click', async e => {
            db.ref('crosswords/').on('value', function(snapshot){
                let counter = 1;
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var data = childSnapshot.val();
                    if(data['author'] == auth.currentUser.email){
                        if(counter == Number(inp_num.value)){
                            id_field.value = key;
                            name_field.value = data['name'];
                            questions_field.value = data['questions'];
                            let cells_inputs = document.getElementsByName('cell');
                            let str = data['answers'];
                            for(var i = 0; i < cells_inputs.length; i++) {
                                cells_inputs[i].value = str.charAt(i) == " " ? "" : str.charAt(i);
                            }
                        }
                        counter++;
                    }
                });
            });
        });

        Delete.addEventListener('click', async e => {
            db.ref('crosswords/').once('value', function(snapshot){
                let counter = 0;
                snapshot.forEach(function(childSnapshot){
                    var data = childSnapshot.val();
                    if(data['author'] == auth.currentUser.email){
                        counter++;
                        if(counter == Number(inp_num.value)){
                            db.ref('crosswords/' + childSnapshot.key).remove(); 
                        }
                    }
                });
            });
            location.reload();
        });

        Create.addEventListener('click', async e => {
            id_field.value = "";
            name_field.value = "";
            questions_field.value = "";
            let cells_inputs = document.getElementsByName('cell');
            for(var i = 0; i < cells_inputs.length; i++) {
                cells_inputs[i].value = "";
            }
            location.reload();
        });

        save.addEventListener('click', async e => {
            let id_value = id_field.value;
            let answers = "";
            let cells_inputs = document.getElementsByName('cell');
            for(var i = 0; i < cells_inputs.length; i++) {
                answers += cells_inputs[i].value == "" ? " " : cells_inputs[i].value;
            }
            db.ref('crosswords/' + id_value).on('value', function(snapshot) {
                if(snapshot.val() == null) {
                    db.ref('crosswords/' + id_value).set({
                        name: name_field.value,
                        height: Constructor.rows,
                        width: Constructor.columns,
                        questions: questions_field.value,
                        answers: answers,
                        author: auth.currentUser.email
                    });
                }
            });
            location.reload();
        });
    }
};

export default Constructor;