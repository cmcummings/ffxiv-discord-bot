// A wrapper for a combination of different FFXIV APIs

const XIVAPI = require('@xivapi/js');
const jobCategories = require("../static_data/job-categories.json");
const jobMap = require("../static_data/job-map.json");
const { Character } = require('./character');
const { FreeCompany } = require('./free-company');
const { Job } = require("./job");

class FFXIVAPI {
    constructor(privateKey) {
        this.xivapi = new XIVAPI({
            private_key: privateKey
        });
    }

    async getDataCenters() {
        if (!this.datacenters) {
            this.datacenters = Object.keys(await this.xivapi.data.datacenters());
        }

        return this.datacenters;
    }

    async getServers() {
        if (!this.servers) {
            this.servers = await this.xivapi.data.servers();
        }

        return this.servers;
    }

    async getJobs() {
        if (!this.jobs) {
            const res = await this.xivapi.data.get("ClassJob");
            this.jobs = [];
            for (const jobData of res.Results) {
                this.jobs.push(new Job(job.ID));
            }
        }

        return this.jobs;
    }

    getJobCategories() {
        return jobCategories;
    }

    async getCharacter(name, server) {
        const searchRes = await this.xivapi.character.search(name, {server: server});
        if (searchRes.Results.length === 0) return;

        const lodestoneID = searchRes.Results[0].ID
        const charData = await this.xivapi.character.get(lodestoneID);

        return new Character(charData);
    }

    async getFreeCompany(name, server) {
        const searchRes = await this.xivapi.freecompany.search(name, {server: server});
        if (searchRes.Results.length === 0) return;

        const lodestoneID = searchRes.Results[0].ID;
        const fcData = await this.xivapi.freecompany.get(lodestoneID);

        return new FreeCompany(fcData);
    }
};

module.exports = { FFXIVAPI }