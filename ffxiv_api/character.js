// Character class constructed from character JSON data

const { CharacterJob } = require("./job");

class Character {
    constructor(data) {
        const char = data.Character

        this.name = char.Name;
        this.datacenter = char.DC;
        this.server = char.Server;
        this.fullBodyImg = char.Portrait;
        this.avatarImg = char.Avatar;
        this.freeCompanyName = char.FreeCompanyName;

        this.jobs = []
        for (const jobData of char.ClassJobs) {
            const job = new CharacterJob(jobData.JobID, jobData.Level);
            
            if (job.id === char.ActiveClassJob.JobID) {
                this.mainJob = job
            }

            this.jobs.push(job);
        }
    }
}

module.exports = { Character }