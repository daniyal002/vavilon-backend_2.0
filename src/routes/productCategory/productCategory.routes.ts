import { Router } from 'express';
import {
  getProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from '../../controllers/productCategories/productCategories.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

//Категории
router.get('/', getProductCategories);
router.get('/:id', getProductCategoryById);
router.post('/', authenticateToken, authorizeAdmin,  createProductCategory);
router.put('/:id', authenticateToken, authorizeAdmin, updateProductCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProductCategory);

export default router;