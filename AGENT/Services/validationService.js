//Validate extracted data and ERP matches: supplier,costcenter, amount, currency;
function validatePurchaseOrder({
    extracted,
    supplier,
    costCenter
}) {
    const errors = [];
    if (!supplier) {
        errors.push(
            `Supplier not found: ${extracted.supplier}`
        );
    }
    if (!costCenter) {
        errors.push(
            `Cost center not found: ${extracted.cost_center}`
        );
    }
    if (
        extracted.amount == null ||
        Number(extracted.amount) <= 0
    ) {
        errors.push(
            'Invalid amount'
        );
    }
    if (!extracted.currency) {
        errors.push(
            'Missing currency'
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}

//Validate line items: itemsname, itemscost, itemquantity;
function validateLineItems(
    lineItems
) {
    const errors = [];
    if (
        !Array.isArray(lineItems) ||
        lineItems.length === 0
    ) {

        return {
            valid: true,
            errors: []
        };
    }
    lineItems.forEach(
        (item, index) => {
            if (!item.item_name) {
                errors.push(
                    `Line item ${index + 1}: missing item_name`
                );
            }
            if (
                item.quantity == null ||
                Number(item.quantity) <= 0
            ) {
                errors.push(
                    `Line item ${index + 1}: invalid quantity`
                );
            }
            if (
                item.unit_price != null &&
                Number(item.unit_price) < 0
            ) {
                errors.push(
                    `Line item ${index + 1}: invalid unit_price`
                );
            }
        }
    );

    return {
        valid:
            errors.length === 0,
        errors
    };
}

//Validate complete PO.
function validatePO({

    extracted,

    supplier,

    costCenter

}) {

    const poValidation =
        validatePurchaseOrder({

            extracted,

            supplier,

            costCenter
        });

    const itemValidation =
        validateLineItems(
            extracted.line_items
        );
    return {
        valid:
            poValidation.valid &&
            itemValidation.valid,
        errors: [

            ...poValidation.errors,

            ...itemValidation.errors
        ]
    };
}

module.exports = {

    validatePurchaseOrder,

    validateLineItems,

    validatePO
};