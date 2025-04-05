export function decodeHeader(header: string): string {
  if (!header) return "";

  const ecre = /=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g;

  return header.replaceAll(ecre, (_, charset, encoding, encodedText) => {
    let decodedText = "";

    try {
      if (encoding.toUpperCase() === "B") {
        decodedText = atob(encodedText.replace(/_/g, "/")); // Ensure Base64 safety
      } else if (encoding.toUpperCase() === "Q") {
        decodedText = encodedText
          .replace(/_/g, " ")
          .replace(/=([A-Fa-f0-9]{2})/g, (_: string, hex: string) =>
            String.fromCharCode(parseInt(hex, 16))
          );
      }
    } catch (error) {
      console.error("Decoding error:", error);
      return encodedText; // Return original encoded text if decoding fails
    }

    try {
      return new TextDecoder(charset || "utf-8").decode(
        new TextEncoder().encode(decodedText)
      );
    } catch (e) {
      console.warn(
        `Text decoding failed for charset: ${charset}, using raw text.`
      );
      return decodedText;
    }
  });
}