import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { authFetch } from '../utils/api';

export interface User {
  id: number;
  email: string;
  createdAt: string;
  profile?: {
    fullName?: string;
  };
  roles: Array<{
    role: {
      id: number;
      name: string;
    };
  }>;
}

export interface PaginatedUserResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function usersLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';

  try {
    const response = await authFetch(`/api/users?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading users:', error);
    return redirect('/login');
  }
}
