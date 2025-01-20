// src/routes/subscription.routes.ts
import { Router } from 'express';
import { saveSubscription } from '../../controllers/subscription/subscription.controller';

const router = Router();

// POST /api/subscriptions
router.post('/save-subscription', saveSubscription);

export default router;
