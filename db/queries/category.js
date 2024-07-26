const getAllCategories = 'SELECT * FROM category';
const getCategoryById = 'SELECT * FROM category WHERE id = $1';
const checkExistCategory = 'SELECT EXISTS (SELECT * FROM category WHERE name = $1)';
const addCategory = 'INSERT INTO category (name) VALUES ($1) RETURNING *';
const updateCategory = 'UPDATE category SET name = $1, updated_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
const deleteCategory = 'DELETE FROM category WHERE id = $1';
const countUseCases = 'SELECT COUNT(*) FROM product WHERE category_id = $1'

module.exports = {
    getAllCategories,
    getCategoryById,
    checkExistCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    countUseCases
}