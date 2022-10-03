const listToChoices = (list) => {
    let choices = []
    
    for (const item of list) {
        choices.push({ name: item, value: item })
    }

    return choices;
}

module.exports = { listToChoices };