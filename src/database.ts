export interface StoredMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  ip_hash: string;
  created_at: string;
}

export type PublicMessage = Omit<StoredMessage, "ip_hash">;

export class MessageStore {
  private messages: StoredMessage[] = [];
  private nextId = 1;

  saveMessage(name: string, email: string, message: string, ipHash: string): number {
    const id = this.nextId++;
    const createdAt = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
    this.messages.push({
      id,
      name,
      email,
      message,
      ip_hash: ipHash,
      created_at: createdAt,
    });
    return id;
  }

  listMessages(limit = 50): PublicMessage[] {
    const bounded = Math.max(1, Math.min(limit, 500));
    return this.messages
      .slice(-bounded)
      .reverse()
      .map(({ id, name, email, message, created_at }) => ({
        id,
        name,
        email,
        message,
        created_at,
      }));
  }

  countMessages(): number {
    return this.messages.length;
  }
}
