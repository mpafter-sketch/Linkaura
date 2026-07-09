/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { uploadMedia } from '../lib/storage';
import { UploadCloud, AlertCircle, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaUploadZoneProps {
  bucket: 'avatars' | 'covers';
  currentUrl: string;
  onUploadComplete: (newUrl: string) => void;
  label: string;
  aspectRatioClassName?: string;
}

export default function MediaUploadZone({
  bucket,
  currentUrl,
  onUploadComplete,
  label,
  aspectRatioClassName = 'aspect-square'
}: MediaUploadZoneProps) {
  const { currentUser } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 Megabytes

  const processFile = async (file: File) => {
    if (!currentUser) {
      setErrorMsg('You must be signed in to upload media.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload JPG, JPEG, PNG or WEBP.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMsg('File too large. Maximum size allowed is 5 MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Perform upload (this also handles client-side compression & automatic replacement of old assets)
      const publicUrl = await uploadMedia(
        currentUser.id,
        file,
        bucket,
        currentUrl,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      onUploadComplete(publicUrl);
      setSuccessMsg(`Successfully uploaded ${bucket === 'avatars' ? 'avatar' : 'cover image'}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2.5" id={`upload-zone-${bucket}`}>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        {label}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition overflow-hidden group flex flex-col items-center justify-center p-6 text-center ${
          isDragging
            ? 'border-violet-500 bg-violet-950/20'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
        } ${aspectRatioClassName}`}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          disabled={isUploading}
        />

        {/* Upload Visual State */}
        {isUploading ? (
          <div className="space-y-3 w-full px-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto" />
            <div className="text-xs text-zinc-300 font-medium">
              Uploading & compressing... {uploadProgress}%
            </div>
            {/* Elegant Custom Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Visual Preview or Default Icon */}
            {currentUrl ? (
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-lg border border-zinc-800 group-hover:scale-105 transition duration-300">
                <img
                  src={currentUrl}
                  alt={`${label} Preview`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <UploadCloud className="h-5 w-5 text-white" />
                </div>
              </div>
            ) : (
              <div className="rounded-full bg-zinc-950 p-3 border border-zinc-800 text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition">
                <UploadCloud className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition">
                Drag & drop or <span className="text-violet-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-zinc-500">
                Supports JPG, PNG, WEBP up to 5 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl bg-rose-950/30 border border-rose-900/40 p-3 text-[11px] text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-3 text-[11px] text-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
