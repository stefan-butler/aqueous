import express from "express";
import chatController from "../controllers/chatController";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.post('/', requireAuth, chatController.createChat);
router.get('/:chatId/messages', requireAuth, chatController.getMessages);
router.get('/check', chatController.checkChatExists)
router.get('/:responderId', requireAuth, chatController.getAllChats);

export default router;