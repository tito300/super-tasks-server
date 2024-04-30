export class Task {
  id: string;
  title: string;
  position: string;
  description?: string;
  completed?: string;
  updated?: string;
  selfLink: string;
  due?: string;
  status: 'needsAction' | 'completed';
}
