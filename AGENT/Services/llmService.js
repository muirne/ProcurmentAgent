const OpenAI = require('openai');
require('dotenv').config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//Prompt for PO extraction. Doubts about delivery date.  
function buildPrompt(documentText) {
    return `
You are an ERP procurement assistant.

Extract purchase order data from the provided document.

Return a JSON object with these keys:

- supplier
- amount
- currency
- cost_center
- description
- requested_delivery_date
- line_items

Each line_items entry must contain:

- item_name
- quantity
- unit_price
- unit

Rules:

- Never invent missing information.
- Return null for unknown values.
- Return valid JSON only.
- The total amount is the total purchase order value.
- If delivery date is ambiguous, return null.
- If item details are missing, return an empty line_items array.

Document:

${documentText}
`;
}

//Extract purchase order information using OpenAI.
async function extractPoDataFromDocument(
    documentText
) {
    const prompt =
        buildPrompt(documentText);
    const response =
        await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'Extract purchase order information accurately. Never guess missing values.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_object'
            }
        });
    return JSON.parse(
        response.choices[0]
            .message.content
    );
}

module.exports = {
    extractPoDataFromDocument
};
