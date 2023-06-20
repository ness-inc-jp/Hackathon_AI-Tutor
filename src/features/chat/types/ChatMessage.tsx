interface BaseChatMessage {
  role: "user" | "ai";
  content: string;
}

export interface UserChatMessage extends BaseChatMessage {
  role: "user";
  checkContent?: string;
}

export interface AIChatMessage extends BaseChatMessage {
  role: "ai";
  audioUrl?: string;
}
