export interface CreatedChatInterface {
  id: string;
  name: string;
  creator: {
    id: number;
    nickname: string;
  };
  users: { id: number; nickname: string }[];
  created_at: Date;
}
