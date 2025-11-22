import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getStatistics,
  restockMaterial,
  takeOutMaterial,
  discardMaterial,
  replaceMaterial,
} from '../controllers/materialController';

const router = express.Router();

// 配置 multer 用于处理文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制 5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片格式
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

// 所有物资路由都需要认证
router.use(authenticate);

// 路由定义
router.get('/materials', getAllMaterials);
router.get('/materials/statistics', getStatistics);
router.get('/materials/:id', getMaterialById);
router.post('/materials', upload.single('photo'), createMaterial);
router.put('/materials/:id', upload.single('photo'), updateMaterial);
router.delete('/materials/:id', deleteMaterial);

// 快捷操作路由
router.post('/materials/:id/restock', restockMaterial);     // 补充库存
router.post('/materials/:id/take-out', takeOutMaterial);    // 领用
router.post('/materials/:id/discard', discardMaterial);     // 报废
router.post('/materials/:id/replace', replaceMaterial);     // 替换

export default router;
