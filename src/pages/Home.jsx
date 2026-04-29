import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div style={styles.logo}>🏠</div>

          <h1 style={styles.title}>Roommate Match</h1>
          <p style={styles.subtitle}>
            Find compatible roommates based on lifestyle, budget, habits, and
            preferences — all in one simple platform.
          </p>

          <div style={styles.buttonRow}>
            <Link to="/register" style={styles.linkReset}>
              <button style={styles.primaryButton}>Create Account</button>
            </Link>

            <Link to="/login" style={styles.linkReset}>
              <button style={styles.secondaryButton}>Login</button>
            </Link>
          </div>

          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Smart Matching</h3>
              <p style={styles.featureText}>
                Get ranked matches based on compatibility and budget fit.
              </p>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Secure Profiles</h3>
              <p style={styles.featureText}>
                User details are stored safely with Firebase authentication.
              </p>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Clean Experience</h3>
              <p style={styles.featureText}>
                Simple design, easy navigation, and clear profile setup flow.
              </p>
            </div>
          </div>
        </div>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heroCard: {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "28px",
    padding: "56px 36px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
    textAlign: "center",
  },

  logo: {
    width: "88px",
    height: "88px",
    borderRadius: "24px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    fontSize: "2rem",
  },

  title: {
    color: "#f9fafb",
    fontSize: "3.5rem",
    fontWeight: "800",
    margin: "0 0 12px",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: "1.1rem",
    lineHeight: "1.7",
    maxWidth: "760px",
    margin: "0 auto 32px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "36px",
  },

  linkReset: {
    textDecoration: "none",
  },

  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#374151",
    color: "#e5e7eb",
    border: "1px solid #4b5563",
    padding: "14px 22px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginTop: "10px",
  },

  featureCard: {
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "18px",
    padding: "22px",
    textAlign: "left",
  },

  featureTitle: {
    color: "#f9fafb",
    fontSize: "1.2rem",
    margin: "0 0 10px",
  },

  featureText: {
    color: "#9ca3af",
    margin: 0,
    lineHeight: "1.6",
  },
};

export default Home;