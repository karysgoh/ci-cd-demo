import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from 'react-router-dom';
import { authFetch } from '../utils/api';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  assignedToId: number | null;
  assignedTo?: {
    id: number;
    email: string;
    profile?: {
      fullName?: string;
    };
  };
}

export interface PaginatedTaskResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function tasksLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';

  try {
    const response = await authFetch(`/api/tasks?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading tasks:', error);
    return redirect('/login');
  }
}

export async function createTaskAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'update') {
      // Update task
      const taskId = formData.get('taskId') as string;
      const title = formData.get('title') as string;
      const assignedToId = formData.get('assignedToId') as string;
      const done = formData.get('done') === 'true';

      const response = await authFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          assignedToId: assignedToId ? parseInt(assignedToId) : null,
          done,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

    } else if (intent === 'delete') {
      // Delete task
      const taskId = formData.get('taskId') as string;

      const response = await authFetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

    } else {
      // Create new task
      const title = formData.get('title') as string;
      const assignedToId = formData.get('assignedToId') as string;

      const response = await authFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          assignedToId: assignedToId ? parseInt(assignedToId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }
    }

    return null;

  } catch (error) {
    console.error('Task action error:', error);
    return { error: 'Failed to perform task action' };
  }
}
