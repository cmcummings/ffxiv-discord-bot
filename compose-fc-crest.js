const Jimp = require("jimp");

const borderURL = "https://img2.finalfantasyxiv.com//c//F2a_1759cb8e3a01da4be479e9af5cc7282d_00_128x128.png";
const bgURL = "https://img2.finalfantasyxiv.com//c//B30_c537b1726c11b3c8ecc2311853a54567_50_128x128.png";
const figureURL = "https://img2.finalfantasyxiv.com//c//S64_9e5290eec6093c9aba14ad5bb9e4c797_02_128x128.png";

(async () => {
    crest = await Jimp.read(bgURL)
    figure = await Jimp.read(figureURL)
    border = await Jimp.read(borderURL)
    crest.composite(figure, 0, 0)
    crest.composite(border, 0, 0)
    crest.write("fc.png");
})();