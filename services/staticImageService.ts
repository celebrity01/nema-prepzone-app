// Map scenario categories to their static images
const SCENARIO_IMAGE_MAP: { [key: string]: string } = {
  "Urban Fire Safety": "/static/images/urban-fire-real.webp",
  "Flood Response": "/static/images/flood-real.webp",
  "Road Traffic Accident":
    "https://cdn.builder.io/api/v1/image/assets%2Fbaef4d28acc542ce9e6b0e6d8ccdf936%2F3df4f3fd03a24e83bd95360f64267f0f?format=webp&width=800",
  "Marketplace Stampede":
    "https://cdn.builder.io/api/v1/image/assets%2Fbaef4d28acc542ce9e6b0e6d8ccdf936%2F07e99fb5c4914e6abfe69a9fe1b3ef3d?format=webp&width=800",
};

export const getStaticScenarioImage = async (
  categoryTitle: string,
): Promise<string> => {
  try {
    const imagePath = SCENARIO_IMAGE_MAP[categoryTitle];

    if (!imagePath) {
      // Return default placeholder for unknown categories
      return createDefaultPlaceholder();
    }

    // Fetch the static image and convert to base64
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status}`);
    }

    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    // Remove the data:image/jpeg;base64, prefix
    return base64.replace(/^data:image\/[a-z]+;base64,/, "");
  } catch (error) {
    console.error("Error loading static scenario image:", error);
    // Fallback to placeholder
    return createDefaultPlaceholder();
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Create a simple placeholder SVG as base64
const createDefaultPlaceholder = (): string => {
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a2e"/>
    <rect x="50" y="50" width="300" height="200" fill="#16213e" stroke="#0f4c75" stroke-width="2"/>
    <text x="200" y="120" font-family="Arial" font-size="16" fill="#e94560" text-anchor="middle">EMERGENCY SCENARIO</text>
    <text x="200" y="150" font-family="Arial" font-size="14" fill="#eee" text-anchor="middle">Disaster Preparedness Training</text>
    <text x="200" y="180" font-family="Arial" font-size="12" fill="#bbb" text-anchor="middle">NEMA PrepZone</text>
  </svg>`;

  // Safely encode SVG to base64
  const encoder = new TextEncoder();
  const data = encoder.encode(svg);
  let binary = "";
  const len = data.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
};
