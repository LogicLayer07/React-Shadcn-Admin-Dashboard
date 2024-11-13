export interface Message {
    sender: string;
    message: string;
    timestamp: string;
    reactions?: { [emoji: string]: number };
    file?: string;
    fileType?: string;
    image?: string;
    recalled?: boolean;
  }
  
  export interface Chats {
    id: string;
    profile: string;
    username: string;
    fullName: string;
    title?: string;
    messages: Message[];
  }