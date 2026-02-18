export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Best-effort text extraction from PDF structure
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('utf-8').decode(uint8Array);
      
      // Try to extract readable text (very basic)
      const readableText = text
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (readableText.length > 50) {
        resolve({
          text: readableText,
          pageCount: 1,
        });
      } else {
        resolve({
          text: 'Could not extract text from PDF. Please use manual input.',
          pageCount: 0,
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        text: 'Error reading PDF file. Please use manual input.',
        pageCount: 0,
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
}
