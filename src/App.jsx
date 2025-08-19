import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(null);
  const [newUser, setNewUser] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const handleClaim = async () => {
    if (!selectedUser) return alert("Select a user first");
    try {
      const res = await axios.post("http://localhost:5000/claim", { userId: selectedUser });
      setPointsAwarded(res.data.points);
      fetchUsers();
      fetchHistory(); // update history after claim
    } catch (err) {
      console.error(err);
      alert("Claim failed, check server.");
    }
  };

  const handleAddUser = async () => {
    if (!newUser) return;
    try {
      await axios.post("http://localhost:5000/users", { name: newUser });
      setNewUser("");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (users.length === 0) return <p>Loading...</p>;

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "2rem", width: "90vw", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#2c3e50" }}>🏆 Game Leaderboard</h1>

      {/* Add User */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Add new user"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "200px" }}
        />
        <button
          onClick={handleAddUser}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem", borderRadius: "6px", border: "none", background: "#3498db", color: "white", cursor: "pointer" }}
        >
          Add User
        </button>
      </div>

      {/* Select & Claim */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", width: "200px" }}
        >
          <option value="">Select User</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <button
          onClick={handleClaim}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem", borderRadius: "6px", border: "none", background: "#27ae60", color: "white", cursor: "pointer" }}
        >
          Claim Points
        </button>
        {pointsAwarded && <p style={{ marginTop: "0.5rem", fontWeight: "bold", color: "#e67e22" }}>🎉 Points Awarded: {pointsAwarded}</p>}
      </div>

      {/* Top 3 Users */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2rem" }}>
        {top3.map((u, index) => {
          const colors = ["#ffd700", "#c0c0c0", "#cd7f32"];
          return (
            <div key={u._id} style={{ background: colors[index], flex: "1", margin: "0 0.5rem", padding: "1rem", borderRadius: "10px", textAlign: "center", color: "#2c3e50", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{["🥇", "🥈", "🥉"][index]}</h3>
              <h2 style={{ margin: "0.5rem 0" }}>{u.name}</h2>
              <p style={{ margin: 0, fontWeight: "bold" }}>{u.totalPoints} Points</p>
            </div>
          )
        })}
      </div>

      {/* Other Users Leaderboard */}
      <div>
        <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: "0.5rem", color: "#2c3e50" }}>Leaderboard</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Rank</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {others.map((u, idx) => (
              <tr key={u._id} style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ padding: "0.5rem" }}>{idx + 4}</td>
                <td style={{ padding: "0.5rem" }}>{u.name}</td>
                <td style={{ padding: "0.5rem" }}>{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Claim History */}
      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ borderBottom: "2px solid #e67e22", paddingBottom: "0.5rem", color: "#2c3e50" }}>Claim History</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>User</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Points</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id} style={{ background: "#fdf6e3" }}>
                <td style={{ padding: "0.5rem" }}>{h.userId.name}</td>
                <td style={{ padding: "0.5rem" }}>{h.points}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(h.claimedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
