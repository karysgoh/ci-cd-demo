import { useLoaderData } from "react-router-dom";
import type { PaginatedUserResponse } from "./users.loaders";

export default function UsersPage() {
  const data = useLoaderData() as PaginatedUserResponse;
  const { users, pagination } = data;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="text-sm text-slate-600">
          {pagination.totalItems} total users
        </div>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-700">
                            {(user.profile?.fullName || user.email.charAt(0))
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {user.profile?.fullName || "No name"}
                        </div>
                        <div className="text-sm text-slate-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{user.email}</div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((userRole) => (
                        <span
                          key={userRole.role.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userRole.role.name === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {userRole.role.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-4">
          <div className="text-sm text-slate-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      )}
    </section>
  );
}
