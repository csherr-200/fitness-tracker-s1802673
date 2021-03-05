import { firestore } from "firebase";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  environment: string;
  status: string;
  owner: {
    displayName: string;
    email: string;
    id: string;
  };
  assignee: string,
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
