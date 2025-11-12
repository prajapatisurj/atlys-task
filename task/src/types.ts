export interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  emoji?: string;
  file?: File;
}
