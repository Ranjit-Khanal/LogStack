export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  streak: number;
  isPublic: boolean;
}

export interface JournalEntry {
  _id: string;
  user: string;
  date: string;
  keyLearnings: string;
  tasksWorkedOn: string;
  challenges: string;
  nextSteps: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntriesResponse {
  entries: JournalEntry[];
  total: number;
  page: number;
  pages: number;
}

export interface EntryFormData {
  date: string;
  keyLearnings: string;
  tasksWorkedOn: string;
  challenges: string;
  nextSteps: string;
  tags: string;
  isPublic: boolean;
}
