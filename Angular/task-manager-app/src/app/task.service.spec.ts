import { TestBed } from '@angular/core/testing';
import { ITask } from './common.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve initial tasks', (done) => {
    service.getTaskValue().subscribe((tasks) => {
      expect(tasks.length).toBe(3);
      done();
    });
  });

  it('should create a new task', (done) => {
    const newTask: Partial<ITask> = {
      id: '4',
      title: 'New Task',
      description: 'Description for new task',
      dueDate: new Date('2024-07-20'),
      priority: 'medium',
      taskStatus: 'todo',
    };

    service.createNewTask(newTask).subscribe((message) => {
      expect(message).toBe('Task Created Successfully');
      service.getTaskValue().subscribe((tasks) => {
        expect(tasks.length).toBe(4);
        expect(tasks[3].title).toBe('New Task');
        done();
      });
    });
  });

  it('should update an existing task', (done) => {
    const updatedTask: Partial<ITask> = {
      id: '1',
      title: 'Updated Task Title',
      description: 'Updated Description',
      dueDate: new Date('2024-07-05'),
      priority: 'high',
      taskStatus: 'todo',
    };

    service.updateTask(updatedTask).subscribe((message) => {
      expect(message).toBe('Task Updated Successfully');
      service.getSpecificTask('1').subscribe((task) => {
        expect(task.title).toBe('Updated Task Title');
        done();
      });
    });
  });

  it('should delete a task', (done) => {
    service.deleteTask('1');
    service.getTaskValue().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks.find((task) => task.id === '1')).toBeUndefined();
      done();
    });
  });

  it('should update task status', (done) => {
    service.updateTaskStatus('2', 'completed');
    service.getSpecificTask('2').subscribe((task) => {
      expect(task.taskStatus).toBe('completed');
      done();
    });
  });

  it('should return error message on create task failure', (done) => {
    spyOn(service as any, 'getReturnMessage').and.callThrough();

    // Force an error scenario by triggering the error manually
    service['insertionCount'] = 1;

    const newTask: Partial<ITask> = {
      id: '5',
      title: 'Error Task',
      description: 'Description causing error',
      dueDate: new Date('2024-07-25'),
      priority: 'low',
      taskStatus: 'todo',
    };

    service.createNewTask(newTask).subscribe({
      next: () => {},
      error: (error) => {
        expect(error.message).toBe('Task Creation Failed');
        done();
      },
    });
  });
});
