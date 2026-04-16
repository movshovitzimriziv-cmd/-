import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface FileUploadProps {
  onFilesChange: (files: { name: string; content: string }[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    return new Promise<{ name: string; content: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          name: file.name,
          content: e.target?.result as string
        });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const processedFiles = await Promise.all(
      Array.from(newFiles).map(file => handleFileRead(file))
    );
    
    const updatedFiles = [...files, ...processedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
          isDragging 
            ? "border-blue-500 bg-blue-50/50" 
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          className="hidden"
          accept=".txt,.md,.json,.csv"
        />
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">גרור קבצים לכאן או לחץ לבחירה</p>
          <p className="text-sm text-slate-500 mt-1">תומך בקבצי טקסט (.txt, .md)</p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
