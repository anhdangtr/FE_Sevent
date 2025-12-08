import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./User.css";

function User() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetchUser();
    }, [page, search]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${API_URL}/user/getAllUser?page=${page}&search=${search}`);
            const data = await res.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

   const updateRole = async (id) => {
    try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "/auth/LogIn";
            return;
        }

        const res = await fetch(`${API_URL}/user/updateRoleUser/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();

        console.log('[updateRole] Response:', data);

        
        if (res.status === 401) {
            alert("Token hết hạn! Vui lòng đăng nhập lại.");
            localStorage.removeItem("authToken");   
            window.location.href = "/auth/LogIn";  
            return;
        }

        if (!data.success) {
            alert(data.message || "Có lỗi xảy ra!");
            return;
        }

        alert("Đổi role thành công!");

        
        if (data.logout) {
            alert("Bạn vừa thay đổi quyền. Hệ thống sẽ đăng xuất bạn.");

            localStorage.removeItem("authToken");      
            window.location.href = "/auth/LogIn";      
            return;
        }

       
        fetchUser();

    } catch (error) {
        console.error('[updateRole] Error:', error);
        alert("Lỗi kết nối server!");
    }
};


    return (
        <div className="user-container">
            <h2 className="user-caption">User Management</h2>

            <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: "10px",
                    width: "260px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    border: "1px solid #ccc"
                }}
            />

            <table className="user-table">
                <thead className="user-thead">
                    <tr className="user-tr">
                        <th className="user-th">Username</th>
                        <th className="user-th">Email</th>
                        <th className="user-th">Role</th>
                        <th className="user-th">Action</th>
                    </tr>
                </thead>

                <tbody className="user-tbody">
                    {users.map((u) => (
                        <tr className="user-tr" key={u._id}>
                            <td className="user-td">{u.name}</td>
                            <td className="user-td">{u.email}</td>
                            <td className="user-td">{u.role}</td>
                            <td className="user-td">
                                <button className="btn-role" onClick={() => updateRole(u._id)}>
                                    Change Role
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" , justifyContent:"center"}}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Prev
                </button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>

        </div>
    );
}

export default User;
