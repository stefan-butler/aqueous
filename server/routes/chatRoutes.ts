import express from "express";
import chatController from "../controllers/chatController";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.get('/:responderId', requireAuth, chatController.getAllChats);
router.post('/', requireAuth, chatController.createChat);
router.get('/:chatId/messages', requireAuth, chatController.getMessages);
router.post('/:chatId/messages', requireAuth, chatController.sendMessage);

export default router;