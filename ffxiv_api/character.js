// Character class constructed from character JSON data

const { EmbedBuilder } = require("discord.js");
const { CharacterJob } = require("./job");
const { colors } = require("../config.json");

class Character {
    constructor(data) {
        const char = data.Character

        this.gender = char.Gender;
        this.id = char.ID;
        this.name = char.Name;
        this.datacenter = char.DC;
        this.server = char.Server;
        this.fullBodyImg = char.Portrait;
        this.avatarImg = char.Avatar;
        this.freeCompanyName = char.FreeCompanyName;
        this.gcId = char.GrandCompany.NameID;
        this.gcRankId = char.GrandCompany.RankID;
        this.guardianId = char.GuardianDeity;
        this.titleId = char.Title;
        this.raceId = char.Race;
        this.tribeId = char.Tribe;

        this.jobs = []
        for (const jobData of char.ClassJobs) {
            const job = new CharacterJob(jobData.JobID, jobData.Level);
            
            if (job.id === char.ActiveClassJob.JobID) {
                this.mainJob = job
            }

            this.jobs.push(job);
        }
    }

    get lodestoneURL() {
        return `https://na.finalfantasyxiv.com/lodestone/character/${this.id}/`;
    }

    async getFullName(xivapi) {
        const title = await xivapi.getTitleById(this.titleId);
        return title.getNameString(this.name);
    }

    async buildGeneralEmbed(xivapi) {
        const serverDesc = `[DC/Server]: ${this.datacenter}/${this.server}`;
        const fcDesc = `[Free Company]: ${this.freeCompanyName}`;
        const curJobDesc = `[Current Job]: ${this.mainJob.name}`;
        const fullName = await this.getFullName(xivapi);
        const desc = `${fullName}\n\n${serverDesc}\n${curJobDesc}\n${fcDesc}`;

        // Construct general tab
        return new EmbedBuilder()
            .setColor(colors.character)
            .setTitle(this.name)
            .setURL(this.lodestoneURL)
            .setDescription(desc)
            .setImage(this.fullBodyImg);
    }

    async buildJobEmbed(xivapi) {
        const curJobDesc = `[Current Job]: ${this.mainJob.name}`;

        const jobEmbedFields = [];

        const jobCategories = xivapi.getJobCategories();
        for (const jobCategoryId in jobCategories) {
            jobEmbedFields.push({ 
                name: jobCategories[jobCategoryId],
                value: this.jobs
                    .filter(job => job.categoryId == jobCategoryId) // Only include jobs of this category
                    .map(job => `${job.name} (${job.level})`) // Convert to string (name + level)
                    .join("\n"), // Separate line by line
                inline: true
            });
        }
        
        return new EmbedBuilder()
            .setColor(colors.character)
            .setTitle(this.name)
            .setURL(this.lodestoneURL)
            .setDescription(`${curJobDesc}`)
            .setThumbnail(this.avatarImg)
            .addFields(jobEmbedFields);
    }
}

module.exports = { Character }