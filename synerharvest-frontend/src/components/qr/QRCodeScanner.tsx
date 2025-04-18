// src/components/qr/QRCodeScanner.tsx
import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  width?: number;
  height?: number;
  facingMode?: 'environment' | 'user';
  className?: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onScanFailure,
  width = 300,
  height = 300,
  facingMode = 'environment', // Use back camera by default
  className = '',
}) => {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Initialize scanner
    const qrScanner = new Html5Qrcode('qr-reader');
    setHtml5QrCode(qrScanner);

    // Clean up when component unmounts
    return () => {
      if (isScanning) {
        qrScanner.stop().catch(error => {
          console.error('Error stopping QR scanner:', error);
        });
      }
    };
  }, []);

  const startScanner = async () => {
    if (!html5QrCode) return;

    try {
      setIsScanning(true);
      await html5QrCode.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: width * 0.7, height: height * 0.7 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          // Optionally stop scanning after successful scan
          // stopScanner();
        },
        (errorMessage) => {
          if (onScanFailure) {
            onScanFailure(errorMessage);
          }
        }
      );
    } catch (error: any) {
      console.error('Error starting QR scanner:', error);
      if (error.toString().includes('Permission denied')) {
        setPermissionDenied(true);
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrCode && isScanning) {
      try {
        await html5QrCode.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping QR scanner:', error);
      }
    }
  };

  return (
    <div className={`qr-scanner-container ${className}`}>
      <div id="qr-reader" style={{ width, height }}></div>
      
      {permissionDenied && (
        <div className="scanner-error">
          <p>Camera access was denied. Please grant permission to use the camera.</p>
        </div>
      )}

      <div className="scanner-controls">
        {!isScanning ? (
          <button 
            onClick={startScanner} 
            className="btn btn-primary"
            disabled={permissionDenied}
          >
            Start Scanner
          </button>
        ) : (
          <button 
            onClick={stopScanner} 
            className="btn btn-outlined"
          >
            Stop Scanner
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;