import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("highest");
  const [filterOption, setFilterOption] = useState("all");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        let currentUserProfile = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.uid === auth.currentUser?.uid) {
            currentUserProfile = data;
          } else {
            users.push(data);
          }
        });

        if (!currentUserProfile) {
          setMatches([]);
          setLoading(false);
          return;
        }

        const scoredMatches = users.map((user) => ({
          ...user,
          compatibility: calculateCompatibility(currentUserProfile, user),
        }));

        setMatches(scoredMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }

      setLoading(false);
    };

    fetchMatches();
  }, []);

  const calculateCompatibility = (currentUser, otherUser) => {
    let score = 0;

    if (currentUser.lifestyle === otherUser.lifestyle) score += 15;
    if (currentUser.sleepSchedule === otherUser.sleepSchedule) score += 15;
    if (currentUser.cleanliness === otherUser.cleanliness) score += 15;
    if (currentUser.smoking === otherUser.smoking) score += 10;
    if (currentUser.pets === otherUser.pets) score += 10;
    if (currentUser.guests === otherUser.guests) score += 10;

    const currentBudget = Number(currentUser.budget);
    const otherBudget = Number(otherUser.budget);

    if (!isNaN(currentBudget) && !isNaN(otherBudget)) {
      const diff = Math.abs(currentBudget - otherBudget);

      if (diff <= 50) score += 25;
      else if (diff <= 100) score += 20;
      else if (diff <= 200) score += 12;
      else if (diff <= 300) score += 6;
    }

    return Math.min(score, 100);
  };

  const getCompatibilityColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#2563eb";
    if (score >= 40) return "#d97706";
    return "#dc2626";
  };

  const getCompatibilityLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Low Match";
  };

  const visibleMatches = useMemo(() => {
    let filtered = [...matches];

    if (filterOption === "excellent") {
      filtered = filtered.filter((m) => m.compatibility >= 80);
    } else if (filterOption === "good") {
      filtered = filtered.filter(
        (m) => m.compatibility >= 60 && m.compatibility < 80
      );
    } else if (filterOption === "fair") {
      filtered = filtered.filter(
        (m) => m.compatibility >= 40 && m.compatibility < 60
      );
    } else if (filterOption === "low") {
      filtered = filtered.filter((m) => m.compatibility < 40);
    }

    if (sortOption === "highest") {
      filtered.sort((a, b) => b.compatibility - a.compatibility);
    } else if (sortOption === "lowest") {
      filtered.sort((a, b) => a.compatibility - b.compatibility);
    } else if (sortOption === "budget-low") {
      filtered.sort((a, b) => Number(a.budget) - Number(b.budget));
    } else if (sortOption === "budget-high") {
      filtered.sort((a, b) => Number(b.budget) - Number(a.budget));
    }

    return filtered;
  }, [matches, sortOption, filterOption]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.brand}>🏠 Roommate Match</div>

          <div style={styles.navActions}>
            <Link to="/" style={styles.linkReset}>
              <button style={styles.secondaryButton}>Home</button>
            </Link>

            <Link to="/edit-profile" style={styles.linkReset}>
              <button style={styles.primaryButton}>Edit Profile</button>
            </Link>

            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Your Matches</h1>
          <p style={styles.subtitle}>
            Ranked roommate matches based on lifestyle compatibility and budget fit.
          </p>
        </div>

        <div style={styles.controls}>
          <select
            style={styles.select}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="highest">Sort: Highest Match</option>
            <option value="lowest">Sort: Lowest Match</option>
            <option value="budget-low">Sort: Lowest Budget</option>
            <option value="budget-high">Sort: Highest Budget</option>
          </select>

          <select
            style={styles.select}
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">Filter: All Matches</option>
            <option value="excellent">Excellent Match</option>
            <option value="good">Good Match</option>
            <option value="fair">Fair Match</option>
            <option value="low">Low Match</option>
          </select>
        </div>

        {loading ? (
          <p style={styles.message}>Loading matches...</p>
        ) : visibleMatches.length === 0 ? (
          <p style={styles.message}>No matches found for this filter.</p>
        ) : (
          <div style={styles.grid}>
            {visibleMatches.map((match, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.topRow}>
                  <div style={styles.profileHeader}>
                    <img
                      src={
                        match.profileImage ||
                        "https://via.placeholder.com/100?text=User"
                      }
                      alt={match.name || "User"}
                      style={styles.profileImage}
                    />

                    <div>
                      <h2 style={styles.name}>{match.name || "Unnamed User"}</h2>
                      <p style={styles.matchLabel}>
                        {getCompatibilityLabel(match.compatibility)}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.scoreBadge,
                      backgroundColor: getCompatibilityColor(match.compatibility),
                    }}
                  >
                    {match.compatibility}% Match
                  </div>
                </div>

                <div style={styles.detailsGrid}>
                  <p style={styles.text}><strong>Age:</strong> {match.age}</p>
                  <p style={styles.text}><strong>Budget:</strong> £{match.budget}</p>
                  <p style={styles.text}><strong>Lifestyle:</strong> {match.lifestyle}</p>
                  <p style={styles.text}><strong>Sleep:</strong> {match.sleepSchedule}</p>
                  <p style={styles.text}><strong>Cleanliness:</strong> {match.cleanliness}</p>
                  <p style={styles.text}><strong>Smoking:</strong> {match.smoking}</p>
                  <p style={styles.text}><strong>Pets:</strong> {match.pets}</p>
                  <p style={styles.text}><strong>Guests:</strong> {match.guests}</p>
                </div>

                <div style={styles.bioBox}>
                  <p style={styles.bio}>{match.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111827",
    padding: "30px 20px 50px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
    padding: "18px 22px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
  },

  brand: {
    color: "#f9fafb",
    fontSize: "1.2rem",
    fontWeight: "800",
  },

  navActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  linkReset: {
    textDecoration: "none",
  },

  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#374151",
    color: "#e5e7eb",
    border: "1px solid #4b5563",
    padding: "12px 18px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  logoutButton: {
    background: "#7f1d1d",
    color: "#fee2e2",
    border: "1px solid #b91c1c",
    padding: "12px 18px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  header: {
    marginBottom: "24px",
  },

  title: {
    color: "#f9fafb",
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "12px",
    marginTop: 0,
    textAlign: "center",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: "1.1rem",
    margin: 0,
    textAlign: "center",
  },

  controls: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "28px",
    justifyContent: "center",
  },

  select: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#e5e7eb",
    fontSize: "0.95rem",
    outline: "none",
  },

  message: {
    color: "#d1d5db",
    textAlign: "center",
    fontSize: "1.1rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  profileImage: {
    width: "74px",
    height: "74px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #374151",
  },

  name: {
    color: "#f9fafb",
    fontSize: "1.5rem",
    margin: 0,
  },

  matchLabel: {
    color: "#9ca3af",
    fontSize: "0.9rem",
    marginTop: "6px",
    marginBottom: 0,
  },

  scoreBadge: {
    color: "white",
    fontWeight: "700",
    fontSize: "0.9rem",
    padding: "10px 14px",
    borderRadius: "999px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 16px",
    marginBottom: "16px",
  },

  text: {
    color: "#d1d5db",
    margin: 0,
    lineHeight: "1.5",
  },

  bioBox: {
    background: "#111827",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "10px",
    border: "1px solid #374151",
  },

  bio: {
    color: "#9ca3af",
    margin: 0,
    lineHeight: "1.6",
  },
};

export default Matches;