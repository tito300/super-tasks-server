export class Task {
  id: string;
  title: string;
  position: string;
  description?: string;
  completed?: string;
  updated?: string;
  status: 'needsAction' | 'completed';
}
