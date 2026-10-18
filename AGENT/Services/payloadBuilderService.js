/**
 * Build Purchase Order payload
 * for ERP API.
 */
function buildPurchaseOrderPayload({

    extracted,

    supplier,

    costCenter,

    approvalFlow
}) {

    return {

        supplier_id:
            supplier.id,

        cost_center_id:
            costCenter.code,

        amount:
            extracted.amount,

        currency:
            extracted.currency,

        description:
            extracted.description,

        requested_delivery_date:
            extracted.requested_delivery_date,

        line_items:
            extracted.line_items || [],

        approval_roles:
            approvalFlow.requiredRoles,

        approvers:
            approvalFlow.approvers
    };
}

module.exports = {
    buildPurchaseOrderPayload
};