
export interface AnalysisResult {
  originalText: string;
  translatedText?: string;
  isLoadingTranslation: boolean;
}

export interface ImageFile {
  base64: string;
  preview: string;
  mimeType: string;
}
