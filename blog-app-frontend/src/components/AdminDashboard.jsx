import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("articles"); // 'articles' or 'users'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, userRes] = await Promise.all([
          axios.get("http://localhost:4000/admin-api/articles", { withCredentials: true }),
          axios.get("http://localhost:4000/admin-api/users", { withCredentials: true })
        ]);
        setArticles(artRes.data.payload);
        setUsers(userRes.data.payload);
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus ? "block" : "unblock";
      const res = await axios.patch(
        `http://localhost:4000/admin-api/${endpoint}/${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
        setArticles(articles.map(art => art.author?._id === userId ? { ...art, author: { ...art.author, isActive: !currentStatus } } : art));
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setView("articles")}
                className={`px-4 py-2 rounded ${view === 'articles' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
                Articles
            </button>
            <button 
                onClick={() => setView("users")}
                className={`px-4 py-2 rounded ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
                Users
            </button>
        </div>
      </div>

      {view === "articles" ? (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            {/* ... table for articles ... */}
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 text-left text-sm">Title</th>
                    <th className="px-4 py-2 text-left text-sm">Author</th>
                    <th className="px-4 py-2 text-left text-sm">Category</th>
                    <th className="px-4 py-2 text-left text-sm">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((art) => (
                    <tr key={art._id} className="border-t">
                        <td className="px-4 py-2 text-sm">{art.title}</td>
                        <td className="px-4 py-2 text-sm">{art.author?.firstName}</td>
                        <td className="px-4 py-2 text-sm">{art.category}</td>
                        <td className="px-4 py-2">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${art.author?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {art.author?.isActive ? "Active" : "Blocked"}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-4 py-2 text-left text-sm">Name</th>
                    <th className="px-4 py-2 text-left text-sm">Email</th>
                    <th className="px-4 py-2 text-left text-sm">Role</th>
                    <th className="px-4 py-2 text-left text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                    <tr key={user._id} className="border-t">
                        <td className="px-4 py-2 text-sm">{user.firstName} {user.lastName}</td>
                        <td className="px-4 py-2 text-sm">{user.email}</td>
                        <td className="px-4 py-2 text-sm">{user.role}</td>
                        <td className="px-4 py-2">
                        <button
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            className={`rounded px-3 py-1 text-xs text-white ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                        >
                            {user.isActive ? "Block" : "Unblock"}
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
