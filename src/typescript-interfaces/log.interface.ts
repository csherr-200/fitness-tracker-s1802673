import { firestore } from "firebase";

export interface Log {
  id: string;
  title: string;
  activityGoals  : string;
  predictedDistance: string;
  actualDistance: string;
  owner: {
    displayName: string;
    email: string;
    id: string;
  };
  createdAt: string;
  logs: Array<{
    personName: string;
    timestamp: firestore.Timestamp;
    statusChangedTo: string;
  }>;
  comments: Array<{
    personName: string;
    timestamp: firestore.Timestamp;
    comment: string;
  }>;
}
