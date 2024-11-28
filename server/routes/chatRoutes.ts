import express from "express";
import chatController from "../controllers/chatController";

const router = express.Router();

router.get('/:responderId', chatController.getAllChats);
router.post('/', chatController.createChat);
router.get('/:chatId/messages', chatController.getMessages);
router.post('/:chatId/messages', chatController.sendMessage);

export default router;