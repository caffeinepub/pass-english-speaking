export async function extractTextFromImage(file: File): Promise<{ text: string; success: boolean }> {
  try {
    // Since tesseract.js is not available in package.json, we cannot perform OCR
    // Return a clear message that manual input is required
    console.log('OCR library not available. Manual input required for image files.');
    
    return {
      text: '',
      success: false,
    };
  } catch (error) {
    console.error('Image OCR error:', error);
    return {
      text: '',
      success: false,
    };
  }
}
