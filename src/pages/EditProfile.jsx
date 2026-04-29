import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditProfile() {
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
    name: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setFormData({
            age: data.age || "",
            budget: data.budget || "",
            lifestyle: data.lifestyle || "",
            sleepSchedule: data.sleepSchedule || "",
            cleanliness: data.cleanliness || "",
            smoking: data.smoking || "",
            pets: data.pets || "",
            guests: data.guests || "",
            bio: data.bio || "",
            name: data.name || "",
            email: data.email || "",
          });

          setCurrentImage(data.profileImage || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No logged in user.");

      let imageUrl = currentImage;

      if (profileImage) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "users", user.uid), {
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
      });

      setCurrentImage(imageUrl);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to update profile.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>Edit Profile</h1>
        <p style={styles.subtitle}>
          Update your roommate preferences and profile details.
        </p>

        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.imageSection}>
            <label style={styles.uploadLabel}>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />

            {(previewUrl || currentImage) && (
              <img
                src={previewUrl || currentImage}
                alt="Profile"
                style={styles.previewImage}
              />
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
            placeholder="Update your bio..."
            value={formData.bio}
            onChange={handleChange}
            rows="5"
            required
          />

          {message && <p style={styles.message}>{message}</p>}

          <button type="submit" style={styles.button} disabled={saving}>
            {saving ? "Saving Changes..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top left, #1d4ed8 0%, #020617 35%, #020617 100%)",
    position: "relative",
    overflow: "hidden",
    padding: "30px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.18)",
    filter: "blur(80px)",
    top: "40px",
    left: "20px",
  },

  glowTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.16)",
    filter: "blur(90px)",
    bottom: "20px",
    right: "40px",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "950px",
    background: "rgba(15, 23, 42, 0.72)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "32px",
    padding: "48px 36px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
    textAlign: "center",
  },

  title: {
    color: "white",
    fontSize: "3.3rem",
    fontWeight: "800",
    margin: "0 0 12px 0",
    letterSpacing: "-2px",
  },

  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "1.15rem",
    lineHeight: "1.7",
    maxWidth: "700px",
    margin: "0 auto 30px auto",
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
    marginBottom: "8px",
  },

  uploadLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
  },

  fileInput: {
    color: "white",
  },

  previewImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.15)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },

  input: {
    width: "100%",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  button: {
    background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    color: "white",
    border: "none",
    padding: "17px",
    borderRadius: "16px",
    fontSize: "1.08rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(59,130,246,0.3)",
  },

  message: {
    color: "#86efac",
    fontSize: "0.95rem",
    margin: 0,
    textAlign: "left",
  },

  loading: {
    color: "white",
    fontSize: "1.2rem",
  },
};

export default EditProfile;