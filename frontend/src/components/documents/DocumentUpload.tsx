import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import type { UploadedFile } from '../../types';

interface DocumentUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

const SUPPORTED_EXTENSIONS = ['.pdf', '.txt', '.csv', '.xlsx', '.docx'];

export function DocumentUpload({ onUpload, isUploading }: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) =>
      SUPPORTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    );

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Supported types: PDF, TXT, CSV, XLSX, DOCX.');
    }

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
    }));

    setSelectedFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    const files = selectedFiles.map((f) => f.file);
    await onUpload(files);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-orange-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.csv,.xlsx,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted" />
        <p className="text-charcoal mb-2">
          Drag and drop your files here, or click to browse
        </p>
        <p className="text-sm text-muted">Supports PDF, TXT, CSV, XLSX and DOCX files</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 px-4 py-2 text-sm text-charcoal border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          Select files
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-sm text-charcoal">{file.name}</p>
                  <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-muted hover:text-charcoal transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload documents'}
          </button>
        </div>
      )}
    </div>
  );
}