'use strict';

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

module.exports = class ToneAnalyser{
    constructor(config) {
        if(!config) console.log('ToneAnalyser error: config file not provided!');
        else {
            this.toneAnalyser = new ToneAnalyzerV3({
                username: config.username,
                password: config.password,
                version_date: config.version_date
            });
        }
    }


    transform(analysis) {
        let result = {};
        let categories = {};

        analysis.document_tone.tone_categories.forEach((cat, ix) =>
            categories[cat.category_id] = cat);

        result.emotion = {};
        categories["emotion_tone"].tones.forEach((item, ix) =>
            result.emotion[item.tone_id] = item.score);

        result.social = {};
        categories["social_tone"].tones.forEach((item, ix) =>
            result.social[item.tone_id] = item.score);

        return result;
    }

    analyse(text) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.toneAnalyser.tone({text},
                (err, tone) => {
                if(err) reject(err);
                else (resolve(tone));
            });
        }).then(self.transform);
    }
}
