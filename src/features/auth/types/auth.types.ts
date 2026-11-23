export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type SessionPayload = {
  userId: string;
  email: string;
  name?: string | null;
  expiresAt: Date;
};
