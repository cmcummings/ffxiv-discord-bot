// Script to update Job map

// Search jobs with ID min -> max
const filePath = "./static_data/job-map.json";
const minJobId = 8;
const maxJobId = 40;

// Create API
require("dotenv").config()
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI({ private_key: process.env.XIVAPI_KEY });

(async () => {
    const data = {};

    for (let i = minJobId; i <= maxJobId; i++) {
        const res = await xiv.data.get("ClassJob", i);
        if (!res) {
            console.log(`Failed to retrieve data for job with ID ${i}`); 
            continue;
        }
        
        data[i] = {
            name: res.NameEnglish, 
            abbreviation: res.Abbreviation, 
            categoryId: res.ClassJobCategoryTargetID,
            roleId: res.Role
        }

        console.log(`Found ${data[i].name}.`);
    }
    
    return data;
})().then(data => {
    const fs = require('fs');
    fs.writeFile(filePath, JSON.stringify(data), 
        err => {
            if (err) throw err;
            console.log('Script complete.');
        }
    );
});


