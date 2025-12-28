
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RefreshCw, ShieldCheck } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied. Please enable it in settings.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateScan = () => {
    // Simulated scan for demo purposes
    setTimeout(() => {
      onScan("OMNI-VALID-TICKET-2024");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 right-8 z-10">
        <button onClick={onClose} className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white bg-slate-900">
            <Camera className="w-12 h-12 text-rose-500 mb-4" />
            <p className="font-bold">{error}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-pulse" />
              <div className="absolute inset-10 border-2 border-white/30 rounded-3xl" />
            </div>
          </>
        )}
      </div>

      <div className="mt-12 text-center text-white space-y-4">
        <h3 className="text-xl font-black tracking-tight">Scan Ticket QR</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">Point your camera at the QR code displayed at the metro gate or bus entry point.</p>
        
        {!error && isScanning && (
          <button 
            onClick={simulateScan}
            className="flex items-center gap-2 mx-auto bg-indigo-600 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
          >
            <ShieldCheck className="w-4 h-4" /> Validate Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
