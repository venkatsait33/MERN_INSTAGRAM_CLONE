import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]); // saving both conversation and message

    // implement socket.io to send message to receiver realtime data transfer
    return res.json({
      message: "Message sent successfully",
      success: true,
      newMessage,
    });
  } catch (error) {
    res.json(error, {
      message: "error" || error,
      success: false,
      error: true,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }); // find conversation between sender and receiver
    if (!conversation)
      return res.status(200).json({ messages: [], success: true });

    return res.status(200).json({
      messages: conversation?.messages,
      success: true,
    });
  } catch (error) {
    res.json(error, {
      message: "error" || error,
      success: false,
      error: true,
    });
  }
};
