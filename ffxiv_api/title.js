class Title {
    constructor(titleData) {
        this.id = titleData.ID;
        this.isPrefix = titleData.IsPrefix == 1 ? true : false;
        this.nameMasculine = titleData.Name;
        this.nameFeminine = titleData.NameFemale;
    }

    getNameString(name, gender) {
        const title = this.getNameByGender(gender);
        return this.isPrefix 
            ? `"${title}" ${name}`
            : `${name} "${title}"`
    }

    getNameByGender(gender) {
        return gender ? this.nameMasculine : this.nameFeminine;
    }
}

module.exports = { Title }