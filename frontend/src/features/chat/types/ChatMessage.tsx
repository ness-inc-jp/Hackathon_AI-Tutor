interface BaseChatMessage {
  role: "user" | "ai";
}

export interface UserChatMessage extends BaseChatMessage {
  role: "user";
  content: string;
  checkContent?: string;
}

export interface AIChatMessage extends BaseChatMessage {
  role: "ai";
  content: string;
  japaneseContent: string;
  audioUrl: string;
}
