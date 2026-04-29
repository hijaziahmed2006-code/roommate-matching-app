import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      navigate("/profile-setup");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>✨</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Set up your account and start your roommate search.
        </p>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111827",
    padding: "30px 20px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "24px",
    padding: "46px 34px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
    textAlign: "center",
  },

  logo: {
    width: "82px",
    height: "82px",
    borderRadius: "22px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 22px",
    fontSize: "1.8rem",
  },

  title: {
    color: "#f9fafb",
    fontSize: "3rem",
    fontWeight: "800",
    margin: "0 0 10px",
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: "28px",
    lineHeight: "1.6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "14px",
    border: "1px solid #374151",
    background: "#111827",
    color: "#f9fafb",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },

  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    color: "#fca5a5",
    margin: 0,
    textAlign: "left",
  },

  bottomText: {
    color: "#9ca3af",
    marginTop: "22px",
  },

  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;