'use strict';

/**
 * Watson wrapper built by Owen Smith and Servian AI.
 * https://www.linkedin.com/in/oclsmith/
 * servian.ai
 *
 * This code provides a basic wrapper around the Watson Developer Cloud Tone Analyser Service.
 * It is written for Node in ES6. The ToneAnalyser module is a Class.
 * Promises are used, but error handling has not yet been built into this module.
 **/

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');


module.exports = class ToneAnalyser {

    /**
     * Constructs the Tone Analyser object.
     * @param  {JSON} config        Configuration variables { username: x, password: y, version_date: z }
     */
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

    /**
     * Transform the output of the ToneAnalyser service into the desired JSON schema
     * @param  {JSON} analysis      Raw output of the Tone Analyser Service
     * @return {JSON}               Restructured JSON output
     */
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

    /**
     * Analyse a text input using the Watson Tone Analyser service
     * @param  {string} text        Raw text input
     * @return {JSON}               Formatted JSON output { emotion: {anger: 0.1, ...}, social: {...} }
     */
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
