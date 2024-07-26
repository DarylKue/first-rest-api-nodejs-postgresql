const pool = require('../db/connection');
const productQueries = require('../db/queries/product');
const checkup = require('../utils/utils');

class ProductController {

    getAllProducts = async (req, res) => {
        try {
            const result = await pool.query(productQueries.getAllProducts);
            if (result) return res.status(200).send({
                status: 'success',
                data: result.rows,
                message: ''
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    getProductById = async (req, res) => {
        try {
            const id = req.params.id
            const result = await pool.query({
                text:productQueries.getProductById,
                values:[id]
            });

            if(!result.rows.length) return res.status(404).send('product not found');

            return res.status(200).send({
                status:'success',
                data:result.rows[0]
            });
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: error.message
            });
        }
    }

    getProductBycategoryId = async (req, res) => {
        try{
            const categoryId = req.params.categoryId;
            const checkIfExist = await pool.query({
                text:productQueries.checkIfExist,
                values:[categoryId]
            });

            if(!checkIfExist.rows[0].exists){
                return res.status(404).send('category id not found');
            }else{
                const result = await pool.query({
                    text:productQueries.getProductByCategoryId,
                    values:[categoryId]
                });

                return res.status(200).send({
                    status:'success',
                    data:result.rows
                });
            }
        }catch(erro){
            res.status(500).send({
                status: 'error',
                message: error.message
            });
        }
    }

    addProduct = async (req, res) => {
        try {
            const { name, description, price, currency, quantity, active, category_id } = req.body;
            const required = ['name', 'price', 'category_id'];
            const firstCheck = checkup.checkAttributesValues(req.body);
            const secondCheck = checkup.checkRequiredAttributes(req.body, required);
            if (firstCheck && secondCheck) {
                const checkIfExist = await pool.query({
                    text: productQueries.checkIfExist,
                    values: [category_id]
                });
                if (!checkIfExist.rows[0].exists) {
                    console.log(checkIfExist.rows[0].exists)
                    res.status(404).send(`The category with the id ${category_id} does not exist`);
                } else {
                    const result = await pool.query({
                        text: productQueries.addProduct,
                        values: [
                            name,
                            description ? description : 'Blank description',
                            price,
                            currency ? currency : 'CFA',
                            quantity ? quantity : 0,
                            'active' in req.body ? active : 'true',
                            category_id
                        ]
                    });
                    return res.status(201).send({
                        status: 'success',
                        data: result.rows
                    });
                }
            } else {
                res.send('You need to send correct informations');
            }
        } catch (error) {
            res.send({
                status: 'error',
                error: error.message
            });
        }
    }

    updateProduct = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, description, price, currency, quantity, active, category_id } = req.body;
            const required = ['name', 'description', 'price', 'currency', 'quantity', 'active', 'category_id'];
            const existProduct = await pool.query({
                text: productQueries.getProductById,
                values: [id]
            });
            if (!existProduct.rows.length) {
                res.status(404).send('The product id in the request params does not match any product in the database');
            } else {
                const firstCheck = checkup.checkAttributesValues(req.body);
                const secondCheck = checkup.checkRequiredAttributes(req.body, required);
                if (firstCheck && secondCheck) {
                    /*const checkExistProduct = await pool.query({
                        text: productQueries.checkExistProduct,
                        values: [name]
                    });*/
                    const checkIfExist = await pool.query({
                        text: productQueries.checkIfExist,
                        values: [category_id]
                    });
                    if (!checkIfExist.rows[0].exists) {
                        res.status(404).send('The category_id does not exist');
                    } else {
                        const result = await pool.query({
                            text: productQueries.updateProduct,
                            values: [name, description, price, currency, quantity, active, category_id, id]
                        });
                        return res.status(200).send({
                            status: 'success',
                            data: result.rows
                        });
                    }

                } else {
                    res.status(422).send('You need to send correct informations');
                }
            }
        } catch (error) {
            res.status(500).send({
                status: 'error',
                error: error.message
            });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const id = req.params.id;
            const existProduct = await pool.query({
                text: productQueries.getProductById,
                values: [id]
            });
            if (!existProduct.rows.length) return res.status(404).send('The product you try to delete does not exist');

            const result = await pool.query({
                text: productQueries.deleteProduct,
                values: [id]
            });
            //console.log(result);
            return res.status(204).send();
        } catch (error) {
            res.status(500).send({
                status: 'error',
                error: error.message
            });
        }
    }
}

module.exports = new ProductController();