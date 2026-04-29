import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    budget: "",
    lifestyle: "",
    sleepSchedule: "",
    cleanliness: "",
    smoking: "",
    pets: "",
    guests: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is logged in.");

      let imageUrl = "";

      if (profileImage) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        age: formData.age,
        budget: formData.budget,
        lifestyle: formData.lifestyle,
        sleepSchedule: formData.sleepSchedule,
        cleanliness: formData.cleanliness,
        smoking: formData.smoking,
        pets: formData.pets,
        guests: formData.guests,
        bio: formData.bio,
        profileImage: imageUrl,
        createdAt: serverTimestamp(),
      });

      setSuccess("Profile saved successfully!");
      setTimeout(() => {
        navigate("/matches");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong while saving your profile.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Complete Your Profile</h1>
        <p style={styles.subtitle}>
          Tell us more about yourself so we can help match you with a compatible roommate.
        </p>

        <form onSubmit={handleSaveProfile} style={styles.form}>
          <div style={styles.imageSection}>
            <label style={styles.uploadLabel}>Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" style={styles.previewImage} />
            )}
          </div>

          <div style={styles.grid}>
            <input
              style={styles.input}
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="number"
              name="budget"
              placeholder="Monthly Budget (£)"
              value={formData.budget}
              onChange={handleChange}
              required
            />

            <select
              style={styles.input}
              name="lifestyle"
              value={formData.lifestyle}
              onChange={handleChange}
              required
            >
              <option value="">Lifestyle</option>
              <option value="quiet">Quiet</option>
              <option value="social">Social</option>
              <option value="balanced">Balanced</option>
            </select>

            <select
              style={styles.input}
              name="sleepSchedule"
              value={formData.sleepSchedule}
              onChange={handleChange}
              required
            >
              <option value="">Sleep Schedule</option>
              <option value="early-bird">Early Bird</option>
              <option value="night-owl">Night Owl</option>
              <option value="flexible">Flexible</option>
            </select>

            <select
              style={styles.input}
              name="cleanliness"
              value={formData.cleanliness}
              onChange={handleChange}
              required
            >
              <option value="">Cleanliness</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              style={styles.input}
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
              required
            >
              <option value="">Smoking</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="occasionally">Occasionally</option>
            </select>

            <select
              style={styles.input}
              name="pets"
              value={formData.pets}
              onChange={handleChange}
              required
            >
              <option value="">Pets</option>
              <option value="love-pets">Love Pets</option>
              <option value="okay-with-pets">Okay with Pets</option>
              <option value="no-pets">No Pets</option>
            </select>

            <select
              style={styles.input}
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
            >
              <option value="">Guests</option>
              <option value="rarely">Rarely</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
            </select>
          </div>

          <textarea
            style={styles.textarea}
            name="bio"
            placeholder="Write a short bio about yourself, your habits, and what kind of roommate you're looking for..."
            value={formData.bio}
            onChange={handleChange}
            rows="5"
            required
          />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.primaryButton} disabled={loading}>
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
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

  card: {
    width: "100%",
    maxWidth: "950px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "24px",
    padding: "46px 34px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
    textAlign: "center",
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
    gap: "18px",
  },

  imageSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
  },

  uploadLabel: {
    color: "#f9fafb",
    fontWeight: "600",
  },

  fileInput: {
    color: "#d1d5db",
  },

  previewImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "3px solid #374151",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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

  textarea: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "14px",
    border: "1px solid #374151",
    background: "#111827",
    color: "#f9fafb",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
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

  success: {
    color: "#86efac",
    margin: 0,
    textAlign: "left",
  },
};

export default ProfileSetup;