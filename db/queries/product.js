const getAllProducts = `SELECT p.id, p.name, p.description, p.price, p.currency, p.quantity, p.active, p.created_date, p.updated_date,
(SELECT ROW_TO_JSON(category_obj) FROM (
    SELECT id, name FROM category WHERE id = p.category_id) category_obj) AS category
FROM product p`;
const getProductById = `SELECT p.id, p.name, p.description, p.price, p.currency, p.quantity, p.active, p.created_date, p.updated_date,
(SELECT ROW_TO_JSON(category_obj) FROM (
    SELECT id, name FROM category WHERE id = p.category_id) category_obj) AS category
FROM product p WHERE p.id = $1`
const getProductByCategoryId = `SELECT p.id, p.name, p.description, p.price, p.currency, p.quantity, p.active, p.created_date, p.updated_date,
(SELECT ROW_TO_JSON(category_obj) FROM (
    SELECT id, name FROM category WHERE id = p.category_id) category_obj) AS category
FROM product p WHERE p.category_id = $1`
const checkIfExist = 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)';
const checkExistProduct = 'SELECT EXISTS (SELECT * FROM product WHERE name = $1)';
const addProduct = 'INSERT INTO product (name, description, price, currency, quantity, active, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
const updateProduct = 'UPDATE product SET name = $1, description = $2, price = $3, currency = $4, quantity = $5, active = $6, category_id = $7, updated_date = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *';
const deleteProduct = 'DELETE FROM product WHERE id = $1'

module.exports = {
    getAllProducts,
    getProductById,
    getProductByCategoryId,
    checkIfExist,
    checkExistProduct,
    addProduct,
    updateProduct,
    deleteProduct
};