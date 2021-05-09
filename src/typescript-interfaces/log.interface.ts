import { firestore } from "firebase";

export interface Log {
  id: string;
  title: string;
  activityGoals  : string;
  predictedDistance: string;
  actualDistance: string;
  startDate: string;
  endDate: string;
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
    email: string;
    timestamp: firestore.Timestamp;
    comment: string;
  }>;
}
