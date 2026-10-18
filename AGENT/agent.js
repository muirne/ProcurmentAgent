require('dotenv').config();

const path = require('path');

const {
    loadDocumentContent,
    listEmailFiles,
    listQuoteFiles,
    moveToProcessed,
    moveToFailed
} = require('./Services/documentService');

const {
    extractPoDataFromDocument
} = require('./Services/llmService');

const {
    loadReferenceData
} = require('./Services/referenceDataService');

const {
    matchSupplier,
    matchCostCenter
} = require('./Services/matchingService');

const {
    validatePO
} = require('./Services/validationService');

const {
    determineApprovalFlow
} = require('./Services/approvalService');

const {
    buildPurchaseOrderPayload
} = require('./Services/payloadBuilderService');

const {
    submitPurchaseOrder
} = require('./Services/purchaseOrderService');


async function processDocument(
    filePath,
    referenceData
) {

    console.log(
        `Processing: ${path.basename(filePath)}`
    );

    const documentText =
        await loadDocumentContent(
            filePath
        );

    const extracted =
        await extractPoDataFromDocument(
            documentText
        );

    console.log(
        'Extracted data:',
        extracted
    );

    const supplier =
        matchSupplier(
            extracted.supplier,
            referenceData.suppliers
        );

    const costCenter =
        matchCostCenter(
            extracted.cost_center,
            referenceData.costCenters
        );

    const validation =
        validatePO({

            extracted,

            supplier,

            costCenter
        });

    if (!validation.valid) {

        throw new Error(
            validation.errors.join(
                ' | '
            )
        );
    }

    const approvalFlow =
        determineApprovalFlow({

            amount:
                extracted.amount,

            currency:
                extracted.currency,

            costCenter,

            approvalLimits:
                referenceData.approvalLimits,

            departments:
                referenceData.departments,

            costCenters:
                referenceData.costCenters,

            employees:
                referenceData.employees,

            fxRates:
                referenceData.fxRates
        });

    console.log(
        'Approval Flow:',
        approvalFlow
    );

    const payload =
        buildPurchaseOrderPayload({

            extracted,

            supplier,

            costCenter,

            approvalFlow
        });

    console.log(
        'Submitting payload:',
        payload
    );

    const result =
        await submitPurchaseOrder(
            payload
        );

    return result;
}


async function runAgent() {

    console.log(
        'Loading ERP reference data...'
    );

    const referenceData =
        await loadReferenceData();

    const emailFiles =
        listEmailFiles();

    const quoteFiles =
        listQuoteFiles();

    const emailPaths =
        emailFiles.map(file =>
            path.join(
                __dirname,
                '../DATA',
                'emails',
                file
            )
        );

    const quotePaths =
        quoteFiles.map(file =>
            path.join(
                __dirname,
                '../DATA',
                'quotes',
                file
            )
        );

    const files = [

        ...emailPaths,

        ...quotePaths
    ];

    console.log(
        `Found ${files.length} documents`
    );

    for (const filePath of files) {

        try {

            const result =
                await processDocument(

                    filePath,

                    referenceData
                );

            console.log(
                'PO Result:',
                result
            );

            moveToProcessed(
                filePath
            );

        } catch (error) {

            console.error(
                `Failed: ${path.basename(filePath)}`
            );

            console.error(
                error.message
            );

            moveToFailed(
                filePath
            );
        }
    }
}

runAgent()
    .then(() => {

        console.log(
            'Agent finished.'
        );

    })
    .catch(error => {

        console.error(
            'Fatal Agent Error:'
        );

        console.error(
            error.message
        );
    });