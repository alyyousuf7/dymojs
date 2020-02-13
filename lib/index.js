'use strict';

const https = require('https');
const fetcher = require('node-fetch');

class Dymo {
    constructor(options) {
        options = options || {};

        this.hostname = options.hostname || '127.0.0.1';
        this.port = options.port || 41951;
        this.agent = new https.Agent({ rejectUnauthorized: false }); // TODO: Bundle the certificates
    }

    get apiUrl() {
        return `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
    }

    print(printerName, labelXml) {
        const label = `printerName=${encodeURIComponent(printerName)}&printParamsXml=&labelXml=${encodeURIComponent(labelXml)}&labelSetXml=`;

        return fetcher(`${this.apiUrl}/PrintLabel`, {
            method: 'POST',
            body: label,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            agent: this.agent,
        })
            .then((response) => response.text())
            .then((result) => result);
    }

    getPrinters() {
        return fetcher(`${this.apiUrl}/GetPrinters`, { agent: this.agent })
            .then((response) => response.text());
    }
}

module.exports = Dymo;
