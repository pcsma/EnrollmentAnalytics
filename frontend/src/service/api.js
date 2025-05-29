// src/services/api.js
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetch("http://localhost:8000/upload/", {
    method: "POST",
    body: formData,
  });
};

export const predictEnrollment = async (text) => {
  return fetch("http://localhost:8000/predict/enrollment/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};
