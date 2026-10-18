const axios = require('axios');

const API_BASE_URL =
    process.env.API_BASE_URL ||
    'http://localhost:3000';

/**
 * Sends validated Purchase Order
 * payload to ERP API.
 */
async function submitPurchaseOrder(
    payload
) {

    try {

        const response =
            await axios.post(
                `${API_BASE_URL}/PO`,
                payload
            );

        return response.data;

    } catch (error) {

        console.error(
            'Purchase Order creation failed:'
        );

        console.error(
            error.response?.data ||
            error.message
        );

        throw error;
    }
}

module.exports = {
    submitPurchaseOrder
};