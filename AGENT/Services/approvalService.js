/**
 * Convert amount to CHF.
 */
function convertToCHF(
    amount,
    currency,
    fxRates
) {

    const rate = fxRates[currency];

    if (!rate) {

        throw new Error(
            `Unknown currency: ${currency}`
        );
    }

    return Number(amount) * rate;
}

/**
 * Find approval rule for amount.
 */
function findApprovalRule(
    amountCHF,
    approvalLimits
) {

    return approvalLimits.find(
        rule => {

            const upperLimit =
                rule.to === null
                    ? Infinity
                    : rule.to;

            return (
                amountCHF >= rule.from &&
                amountCHF <= upperLimit
            );
        }
    );
}

/**
 * Find department head.
 */
function getDepartmentHead(
    departmentCode,
    departments,
    employees
) {

    const department =
        departments.find(
            dep =>
                dep.code ===
                departmentCode
        );

    if (!department) {
        return null;
    }

    return employees.find(
        employee =>
            employee.id ===
            department.head_employee_id
    );
}

/**
 * Find cost center owner.
 */
function getCostCenterOwner(
    costCenterCode,
    costCenters,
    employees
) {

    const costCenter =
        costCenters.find(
            cc =>
                cc.code ===
                costCenterCode
        );

    if (!costCenter) {
        return null;
    }

    return employees.find(
        employee =>
            employee.id ===
            costCenter.owner_employee_id
    );
}

/**
 * Determine required approvers.
 */
function determineApprovalFlow({

    amount,

    currency,

    costCenter,

    approvalLimits,

    departments,

    costCenters,

    employees,

    fxRates
}) {

    const amountCHF =
        convertToCHF(
            amount,
            currency,
            fxRates
        );

    const rule =
        findApprovalRule(
            amountCHF,
            approvalLimits
        );

    if (!rule) {

        throw new Error(
            'No approval rule found.'
        );
    }

    const approvers = [];

    for (const role of rule.required_roles) {

        switch (role) {

            case 'cost_center_owner':

                approvers.push(
                    getCostCenterOwner(
                        costCenter.code,
                        costCenters,
                        employees
                    )
                );

                break;

            case 'department_head':

                approvers.push(
                    getDepartmentHead(
                        costCenter.department,
                        departments,
                        employees
                    )
                );

                break;

            case 'finance':

                approvers.push(

                    employees.find(
                        employee =>
                            employee.role ===
                            'finance'
                    )
                );

                break;

            case 'cfo':

                approvers.push(

                    employees.find(
                        employee =>
                            employee.role ===
                            'cfo'
                    )
                );

                break;

            case 'ceo':

                approvers.push(

                    employees.find(
                        employee =>
                            employee.role ===
                            'ceo'
                    )
                );

                break;
        }
    }

    return {

        amountCHF,

        requiredRoles:
            rule.required_roles,

        approvers:
            approvers.filter(Boolean)
    };
}

module.exports = {

    convertToCHF,

    findApprovalRule,

    getCostCenterOwner,

    getDepartmentHead,

    determineApprovalFlow
};