
//Match supplier by name.
function matchSupplier(
    supplierName,
    suppliers
) {
    if (!supplierName) {
        return null;
    }
    return suppliers.find(
        supplier =>
            supplier.name
                .toLowerCase()
                .includes(
                    supplierName.toLowerCase()
                )
    );
}

//Match cost center by code.
function matchCostCenter(
    costCenterCode,
    costCenters
) {
    if (!costCenterCode) {
        return null;
    }
    return costCenters.find(
        costCenter =>
            String(costCenter.code)
                .trim()
                .toLowerCase() ===
            String(costCenterCode)
                .trim()
                .toLowerCase()
    );
}

module.exports = {

    matchSupplier,

    matchCostCenter
};