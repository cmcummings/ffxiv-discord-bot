// Job class constructed from job JSON data

const jobMap = require("../static_data/job-map.json");
const jobCategories = require("../static_data/job-categories.json");
const jobRoles = require("../static_data/job-roles.json");

class Job {
    constructor(id) {
        this.id = id;
    }

    get name() {
        return jobMap[this.id].name;
    }

    get abbreviation() {
        return jobMap[this.id].abbreviation;
    }

    get categoryId() {
        return jobMap[this.id].categoryId;
    }

    get categoryName() {
        return jobCategories[this.categoryId];
    }

    get roleId() {
        return jobMap[this.id].roleId;
    }

    get roleName() {
        return jobRoles[this.roleId];
    }
}

// CharacterJobs can have levels and experience
class CharacterJob extends Job {
    constructor(id, level) {
        super(id);
        this.level = level;
    }
}

module.exports = { Job, CharacterJob }