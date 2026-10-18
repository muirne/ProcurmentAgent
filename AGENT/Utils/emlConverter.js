const fs = require('fs');
const emlFormat = require('eml-format');

async function convertEmlToText(
    filePath
) {

    const rawEmail =
        fs.readFileSync(
            filePath,
            'utf8'
        );

    const parsedEmail =
        await new Promise(
            (resolve, reject) => {

                emlFormat.read(
                    rawEmail,
                    (error, data) => {

                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(data);
                    }
                );
            }
        );

    const text =
        parsedEmail.text ||

        parsedEmail.html?.replace(
            /<[^>]+>/g,
            ''
        ) ||

        '';

    return text
        .replace(
            /\r?\n\s*\r?\n/g,
            '\n'
        )
        .trim();
}

module.exports = {
    convertEmlToText
};