export class CreateTaskDto {
  title: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
}
