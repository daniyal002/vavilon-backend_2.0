// src/types/pushSubscription.ts
export interface PushSubscription {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  }