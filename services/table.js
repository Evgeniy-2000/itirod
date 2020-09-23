const Table = {
    renderTable: (width, height) =>{
        let table_cells = '';
        for (var i = 0; i < height; i++) {
            table_cells += "<tr>";
            for (var j = 0; j < width; j++) {
                if(i == 0 && j > 0){
                    table_cells += '<td><input class=\"table_cell\" maxlength="1" readonly name="cell" value="' + j + '"></td>';
                } else if(j == 0 && i > 0){
                    table_cells += '<td><input class=\"table_cell\" maxlength="1" readonly name="cell" value="' + String.fromCharCode(64 + i) + '"></td>';
                }
                else if(i == 0 && j == 0){
                    table_cells += '<td><input class=\"table_cell\" readonly maxlength="1" name="cell"></td>';
                }
                else{
                    table_cells += '<td><input class=\"table_cell\" maxlength="1" name="cell"></td>';
                }
            }
        }
        return table_cells + "</tr>";
    },
}

export default Table;