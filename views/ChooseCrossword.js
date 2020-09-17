let ChooseCrossword = {
    render: () => {
        return `<article align="center" class="choose_crossword" id="center">
                <input placeholder="Id" class="choose_elements_button" id="inp_id">
                <button  class="choose_elements" id="Show_info">Show info</button>
                <button  class="choose_elements" id="Solve">Solve</button>
                <div id="for-insert-1"></div>
            </article>`
    },

    afterRender: async () => {
        const Show_info = document.getElementById('Show_info');
        const Solve = document.getElementById('Solve');
        const input_id = document.getElementById('inp_id');
        let ins1 = document.getElementById('for-insert-1');
        let _data = `<table cellspacing="0" class="table_stat"><tr>
                <th><p class="res_table_head">
                    Name
                </p></th>
                <th><p class="res_table_head">
                    Id
                </p></th>
                <th><p class="res_table_head">
                    Author
                </p></th></tr>`;

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (!firebaseUser){
                window.location.hash = '/';
            }
        });
                
        db.ref('crosswords/').on('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key;
                var data = childSnapshot.val();
                _data += `<tr><td><p class="res_table">`+ data['name']  + `</p></td>
                <td><p class="res_table">` + key + ` </p></td>
                <td><p class="res_table">`+ data['author'] +` </p></td></tr>`;
            });
        });
        _data +=`</table>`;

        ins1.innerHTML = _data;

        Show_info.addEventListener('click', async e => {

            var res = '\nresults:\n';
            db.ref('crosswords/' + input_id.value + '/results').on('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var data = childSnapshot.val();
                    res += key + ' - ' + data['result'] + '\n';
                });
            });

            db.ref('crosswords/').on('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var data = childSnapshot.val();
                    if(key == input_id.value){
                        alert('Id: ' + key + '\nName: ' + data['name'] + '\nAuthor: ' + data['author'] + res);
                        return;
                    }
                });
            });

        });

        Solve.addEventListener('click', async e => {
            window.location.hash = '/solve/' + input_id.value;
        });
    },
};

export default ChooseCrossword;