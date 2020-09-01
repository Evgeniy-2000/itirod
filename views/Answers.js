let ChooseCrossword = {
    render: (all) => {
        ChooseCrossword.all = all;
        ChooseCrossword.etalonAnswer = ChooseCrossword.all[0];
        return `
        <div class="stat"><h2>Эталонное решение</h2></div>
        <div class="answers-list">${Answers.renderItem(Answers.etalonAnswer.length, Answers.etalonAnswer[0].length, 0)}</div>
        <div class="stat"><h2>Статистика решений</h2></div>
        <div class="answers-list">${Answers.listItems()}</div>
        `
    },

    listItems: () => {
        let markup= ``;
        for(let i in Answers.all) {
            if(i != 0) {
                markup += Answers.renderItem(Answers.all[0].length, Answers.all[0][i].length, i);
            }
        }
        return markup;
    },

    renderItem: (rows, columns, number) => {
        return `
        <div class="answer-item">
            <table>${Answers.renderTable(rows, columns, number)}</table>
        </div>
        `
    },

    renderTable: (rows, columns, number) => {
        let markup = ``;
        for(let i = 0; i < rows; i++) {
            markup += Answers.renderTR(i, columns, number);
        }
        return markup;
    },

    renderTR: (i, columns, number) => {
        let markup = ``;
        for(let j = 0; j < columns; j++) {
            markup += Answers.all[number][i][j] == '0' ? Answers.renderEmptyTD(i, j) : Answers.renderTD(i, j, number);
        }
        return `
        <tr>${markup}</tr>
        `
    },

    renderTD: (i, j, number) => {
        return `
        <td id="${i}-${j}" class="not-empty">${Answers.all[number][i][j]}</td>
        `
    },

    renderEmptyTD: (i, j) => {
        return `
        <td id="${i}-${j}"></td>
        `
    },

    afterRender: async () => {

    },

    all: [],
    etalonAnswer: null
};

export default ChooseCrossword;