const axios = require('axios');
const API_BASE_URL =
    process.env.API_BASE_URL ||
    'http://localhost:3000';


//Load all reference data from ERP API (master data). 
async function loadReferenceData() {
    try {
        const [
            suppliersRes,
            costCentersRes,
            employeesRes,
            departmentsRes,
            glAccountsRes,
            fxRes,
            approvalLimitsRes,
            rulesRes
        ] = await Promise.all([
            axios.get(
                `${API_BASE_URL}/suppliers`
            ),
            axios.get(
                `${API_BASE_URL}/cost_centers`
            ),
            axios.get(
                `${API_BASE_URL}/employees`
            ),
            axios.get(
                `${API_BASE_URL}/departments`
            ),
            axios.get(
                `${API_BASE_URL}/gl_accounts`
            ),
            axios.get(
                `${API_BASE_URL}/fx`
            ),
            axios.get(
                `${API_BASE_URL}/approval_limits`
            ),
            axios.get(
                `${API_BASE_URL}/rules`
            )
        ]);
        return {
            suppliers:
                suppliersRes.data,
            costCenters:
                costCentersRes.data,
            employees:
                employeesRes.data,
            departments:
                departmentsRes.data,
            glAccounts:
                glAccountsRes.data,
            fxRates:
                fxRes.data,
            approvalLimits:
                approvalLimitsRes.data,
            rules:
                rulesRes.data
        };

    } catch (error) {
        console.error(
            'Failed to load reference data:'
        );
        console.error(
            error.response?.data ||
            error.message
        );
        throw error;
    }
}

module.exports = {
    loadReferenceData
};