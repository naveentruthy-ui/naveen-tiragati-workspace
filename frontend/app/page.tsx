"use client";
import { useState } from "react";
import styles from "./VehicleForm.module.scss";

export default function VehicleForm() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [badge, setBadge] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false); // ✅ spinner
  const [showSuccess, setShowSuccess] = useState(false); // ✅ success popup

  const MODELS: any = {
    ford: {
      Ranger: ["Raptor", "Wildtrak"],
      Falcon: ["XR6", "XR8"],
    },
    tesla: {
      "Model 3": ["Performance", "Long Range"],
    },
  };

  const QUICK_SELECTS = [
    { make: "ford", model: "Ranger", badge: "Raptor" },
    { make: "tesla", model: "Model 3", badge: "Performance" },
  ];

  const models = make ? Object.keys(MODELS[make]) : [];
  const badges = make && model ? MODELS[make][model] : [];

  const handleQuickSelect = (vehicle: any) => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setBadge(vehicle.badge);
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true); // ✅ start spinner

    try {
      const text = await readFile(file);

      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make,
          model,
          badge,
          log: text,
        }),
      });

      await res.json();

      // ✅ show success popup
      setShowSuccess(true);

      // auto hide after 3 sec
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // ✅ stop spinner
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Vehicle Form</h1>

        {/* ✅ Success Popup */}
        {showSuccess && (
          <div className={styles.successPopup}>✅ Submitted successfully!</div>
        )}

        {/* Quick Select */}
        <div className={styles.quickSelectContainer}>
          {QUICK_SELECTS.map((v, index) => (
            <button
              key={index}
              className={styles.quickButton}
              onClick={() => handleQuickSelect(v)}
            >
              {v.make} {v.model} {v.badge}
            </button>
          ))}
        </div>

        <div className={styles.formGroup}>
          {/* Make */}
          <select
            className={styles.select}
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel("");
              setBadge("");
            }}
          >
            <option value="">Select Make</option>
            {Object.keys(MODELS).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* Model */}
          <select
            className={styles.select}
            value={model}
            disabled={!make}
            onChange={(e) => {
              setModel(e.target.value);
              setBadge("");
            }}
          >
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* Badge */}
          <select
            className={styles.select}
            value={badge}
            disabled={!model}
            onChange={(e) => setBadge(e.target.value)}
          >
            <option value="">Select Badge</option>
            {badges.map((b: string) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          {/* File */}
          <label className={styles.fileUpload}>
            <input
              className={styles.fileInput}
              type="file"
              accept=".txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span className={styles.fileText}>
              {file ? file.name : "Upload logbook (.txt)"}
            </span>
          </label>

          {/* Submit */}
          <button
            className={styles.button}
            disabled={!make || !model || !badge || !file || loading}
            onClick={handleSubmit}
          >
            {loading ? <span className={styles.spinner}></span> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
