// utils/getDestinationImage.ts
export const getDestinationImage = async (query: string): Promise<string | null> => {
  try {
    const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY!,
        },
      }
    );

    if (!res.ok) throw new Error("Pexels request failed");

    const data = await res.json();

    return data.photos?.[0]?.src?.landscape || null;
  } catch (err) {
    console.error("Pexels error:", err);
    return null;
  }
};