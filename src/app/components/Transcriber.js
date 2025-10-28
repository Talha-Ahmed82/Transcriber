"use client";
import { useState } from "react";

export default function Transcriber() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an audio file first!");
      return;
    }

    setLoading(true);
    setText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.text) setText(data.text);
      else alert("❌ Transcription failed. Try again.");
    } catch (error) {
      alert("❌ Transcription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    } else {
      alert("Please drop an audio file!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-ping"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Audio Transcriber
          </h1>
          <p className="text-gray-300 text-lg">
            Convert your audio files to text with AI-powered transcription
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
                : file 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-gray-600 hover:border-cyan-400 hover:bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    {file ? "File Selected ✓" : "Choose Audio File"}
                  </p>
                  <p className="text-gray-400">
                    {file ? file.name : "Drag & drop or click to browse"}
                  </p>
                  {file && (
                    <p className="text-sm text-cyan-400 mt-2">
                      Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Convert Button */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full cursor-pointer py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              loading || !file
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-linear-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>Transcribing Audio...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Convert to Text</span>
              </div>
            )}
          </button>
        </form>

        {/* Transcription Result */}
        {text && (
          <div className="mt-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Transcription Result</span>
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(text);
                  alert('Text copied to clipboard!');
                }}
                className="flex cursor-pointer items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </button>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
                {text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}