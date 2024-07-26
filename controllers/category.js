const pool = require('../db/connection');
const categoryQueries = require('../db/queries/category');
const checkup = require('../utils/utils');

class CategoryController {

    getAllCategories = async (req, res) => {
        try {
            const result = await pool.query(categoryQueries.getAllCategories);
            if (result) return res.status(200).send({
                status: 'success',
                data: result.rows,
                message: ''
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            })
        }
    }

    addCategory = async (req, res) => {
        try {
            const name = req.body.name;
            if (name) {
                const checkIfExist = await pool.query({
                    text: categoryQueries.checkExistCategory,
                    values: [name]
                });
                if (checkIfExist.rows[0].exists) {
                    res.status(409).send(`The ${name} category already exists`);
                } else {
                    const result = await pool.query({
                        text: categoryQueries.addCategory,
                        values: [name]
                    });
                    return res.status(201).send({
                        status: 'success',
                        data: result.rows
                    });
                }
            } else {
                res.send('Empty field cannot be add');
            }
        } catch (error) {
            res.status.send({
                status: 'error',
                error: error.message
            });
        }
    }

    updateCategory = async (req, res) => {
        try {
            const name = req.body.name;
            const id = req.params.id
            const firstCheck = checkup.checkAttributesValues(req.body);
            const secondCheck = checkup.checkRequiredAttributes(req.body, ['name']);
            if (firstCheck && secondCheck) {
                const checkIfExist = await pool.query({
                    text: categoryQueries.checkExistCategory,
                    values: [name]
                });
                if (checkIfExist.rows[0].exists) {
                    return res.status(409).send(`The category with the name ${name} already exists`)
                } else {
                    const result = await pool.query({
                        text: categoryQueries.updateCategory,
                        values: [name, id]
                    });

                    if (result.rowCount == 0) return res.status(404).send('Category not found');
                    return res.status(200).send({
                        status: 'success',
                        data: result.rows
                    });
                }
            } else {
                res.status(422).send('You need to send correct informations');
            }
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                error: error.message
            });
        }
    }

    deleteCategory = async (req, res) => {
        try {
            const id = req.params.id;
            const countResult = await pool.query({
                text: categoryQueries.countUseCases,
                values: [id]
            });
            if (countResult.rows[0].count > 0) return res.status(409).send(`The category you try to delete is use by ${countResult.rows[0].count} product(s)`);

            const existCategory = await pool.query({
                text: categoryQueries.getCategoryById,
                values: [id]
            });
            if (!existCategory.rows.length) {
                return res.status(404).send('The category you try to delete does not exist');
            } else {
                const result = await pool.query({
                    text: categoryQueries.deleteCategory,
                    values: [id]
                });
                //console.log(result);
                return res.status(204).send();
            }
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                error: error.message
            });
        }
    }
}

module.exports = new CategoryController();