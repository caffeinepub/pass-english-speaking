export async function extractTextFromImage(file: File): Promise<{ text: string; success: boolean; message?: string }> {
  try {
    // Since tesseract.js is not available in package.json, we cannot perform OCR
    // Return a clear message that manual input is required
    console.log('OCR library not available. Manual input required for image files.');
    
    return {
      text: '',
      success: false,
      message: 'Text extraction from images is not available. Please use the manual input field below.',
    };
  } catch (error) {
    console.error('Image OCR error:', error);
    return {
      text: '',
      success: false,
      message: 'Failed to process image. Please use the manual input field below.',
    };
  }
}
