import Table from '../services/table.js'

let Constructor = {

    render: async () => {
        Constructor.rows = 8;
        Constructor.columns = 10;

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
                    <div>
                        <input placeholder="Hor" type="number" min="5" max="10" class="entry_dimension" id="hor_entry" maxlength="2">
                        <input placeholder="Ver" type="number" min="5" max="10" class="entry_dimension" id="ver_entry" maxlength="2">
                        <button id="change_dim_button">Change</button>
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
                    <table cellpadding="0px" cellpadding="0px" id="table_cells">
                        ${Table.renderTable(10, 8)}
                    </table>
                </article>

        `;
    },
 

    afterRender: async () => {
        const save = document.getElementById('save_button');
        const id_field = document.getElementById('id_entry');
        const name_field = document.getElementById('name_entry');
        const questions_field = document.getElementById('questions_entry');
        const hor_field = document.getElementById('hor_entry');
        const ver_field = document.getElementById('ver_entry');
        const table = document.getElementById('table_cells');
        hor_field.value = 10;
        ver_field.value = 8;

        const Change = document.getElementById('Change');
        const Delete = document.getElementById('Delete');
        const Create = document.getElementById('Create');
        const inp_num = document.getElementById('inp_num');
        const change_dimension = document.getElementById('change_dim_button');

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (!firebaseUser){
                window.location.hash = '/';
            }
        });
        
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
                            let width = data['width'];
                            let height = data['height'];
                            table.innerHTML = Table.renderTable(width, height);
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
            let name_value = name_field.value;
            if(name_value.length == 0 || id_value.length == 0){
                alert('Name and Id fields cant be empty!')
                return;
            }
            let answers = "";
            let cells_inputs = document.getElementsByName('cell');
            for(var i = 0; i < cells_inputs.length; i++) {
                answers += cells_inputs[i].value == "" ? " " : cells_inputs[i].value;
            }
            db.ref('crosswords/' + id_value).on('value', function(snapshot) {
                db.ref('crosswords/' + id_value).set({
                    name: name_value,
                    height: Constructor.rows,
                    width: Constructor.columns,
                    questions: questions_field.value,
                    answers: answers,
                    author: auth.currentUser.email
                });
            });
            location.reload();
        });

        /*This function changes dimension of our table and keeps letters, that table contains*/
        change_dimension.addEventListener('click', async e => {
            let hor_count_prev = Constructor.columns;
            let ver_count_prev = Constructor.rows;
            let hor_count = hor_field.value;
            let ver_count = ver_field.value;
            let cells_inputs = document.getElementsByName('cell');

            Constructor.rows = ver_count;
            Constructor.columns = hor_count;
            let table_cells = '';
            for (var i = 0; i < ver_count; i++) {
                table_cells += "<tr>";
                for (var j = 0; j < hor_count; j++) {
                    if(i == 0 && j > 0){
                        table_cells += '<td><input class="table_cell" maxlength="1" readonly name="cell" value="' + j + '"></td>';
                    } else if(j == 0 && i > 0){
                        table_cells += '<td><input class=\"table_cell\" maxlength="1" readonly name="cell" value="' + String.fromCharCode(64 + i) + '"></td>';
                    }
                    else if(i == 0 && j == 0){
                        table_cells += '<td><input class=\"table_cell\" readonly maxlength="1" name="cell"></td>';
                    }
                    else{
                        let cell_value = "";
                        if(j < hor_count_prev && i < ver_count_prev){
                            cell_value = cells_inputs[i * hor_count_prev + j].value;
                        }
                        table_cells += '<td><input class="table_cell" maxlength="1" name="cell" value="' + cell_value + '"></td>';
                    }
                }
            }
            table_cells += "</tr>";
            table.innerHTML = table_cells;
        });

    }
};

export default Constructor;