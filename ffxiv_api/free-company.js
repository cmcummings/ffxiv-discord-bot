// FreeCompany class constructed from FC JSON data

const Jimp = require("jimp");

class FreeCompany {
    constructor(fcData) {
        const fc = fcData.FreeCompany;

        this.name = fc.Name;
        this.server = fc.Server;
        this.activeMemberCount = fc.ActiveMemberCount;
        this.tag = fc.Tag;
        this.slogan = fc.Slogan;
        this.crestImgURLs = fc.Crest;
    }

    async getCrestAsBuffer() {
        const crest = await Jimp.read(this.crestImgURLs[0]) // background
        crest.composite(await Jimp.read(this.crestImgURLs[2]), 0, 0) // figure
        crest.composite(await Jimp.read(this.crestImgURLs[1]), 0, 0) // border
        return await crest.getBufferAsync(Jimp.MIME_PNG); 
    }

    buildEmbed() {
        return new EmbedBuilder()
            .setTitle(`${fc.name} <${fc.tag}>`)
            .setDescription(`${fc.slogan}`)
            .setColor(colors.icon)
            .addFields(
                { name: "Server", value: fc.server, inline: true },
                { name: "Members", value: `${fc.activeMemberCount}`, inline: true}
            )
    }
}

module.exports = { FreeCompany }