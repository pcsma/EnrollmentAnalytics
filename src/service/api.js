export const API_BASE = import.meta.env.VITE_API_BASE;
console.log("📡 Using API BASE:", API_BASE);
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
};
