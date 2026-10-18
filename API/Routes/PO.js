const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {

    try {

        const {

            supplier_id,
            cost_center_id,
            amount,
            currency,
            description,
            requested_delivery_date,
            line_items,
            approval_roles,
            approvers

        } = req.body;

        const orderLineItems =

            Array.isArray(line_items) &&
            line_items.length > 0

                ? line_items

                : description

                    ? [{
                        item_name: description,
                        quantity: 1,
                        unit_price: Number(amount),
                        unit: 'order'
                    }]

                    : [];

        const payload = {

            supplier_id,

            currency,

            total: Number(amount),

            requested_delivery_date,

            cost_centre: cost_center_id,

            line_items: orderLineItems,

            approval_roles,

            approvers
        };

        console.log(
            'Sending payload to Python:',
            payload
        );

        const response =
            await fetch(
                'http://127.0.0.1:8080/purchase-orders',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify(
                        payload
                    )
                }
            );

        const result =
            await response.json();

        console.log(
            'Python API status:',
            response.status
        );

        console.log(
            'Python API response:',
            result
        );

        return res
            .status(response.status)
            .json(result);

    } catch (err) {

        console.error(
            'PO route error:'
        );

        console.error(err);

        return res.status(502).json({

            error:
                'Could not reach or process response from Python PO API',

            details:
                err.message
        });
    }
});

router.get('/', (req, res) => {

    res.json({

        message:
            'PO endpoint active'
    });

});

module.exports = router;