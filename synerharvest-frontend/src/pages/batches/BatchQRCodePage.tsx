// src/pages/batches/BatchQRCodePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../../components/qr/QRCodeGenerator';
import batchService, { Batch } from '../../services/batchService';

const BatchQRCodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrSize, setQrSize] = useState(250);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');
  const qrRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setIsLoading(true);
        const batchId = parseInt(id as string);
        if (isNaN(batchId)) {
          throw new Error('Invalid batch ID');
        }
        
        const data = await batchService.getBatch(batchId);
        setBatch(data);
      } catch (err) {
        console.error('Error fetching batch details:', err);
        setError('Failed to load batch details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

  // Generate the URL that the QR code will point to
  const getTrackingUrl = () => {
    if (!batch?.batchCode) return '';
    
    const baseUrl = 'https://synerharvest.com/tracking/';
    return `${baseUrl}${batch.batchCode}`;
  };

  // Function to download the QR code
  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    
    if (downloadFormat === 'png') {
      // Get the canvas data URL as PNG
      const dataUrl = canvas.toDataURL('image/png');
      link.href = dataUrl;
      link.download = `synerharvest-batch-${batch?.batchCode || id}.png`;
    } else {
      // Create SVG from canvas
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", qrSize.toString());
      svg.setAttribute("height", qrSize.toString());
      svg.setAttribute("viewBox", `0 0 ${qrSize} ${qrSize}`);
      
      // Create image element and set attributes
      const image = document.createElementNS(svgNS, "image");
      image.setAttribute("width", qrSize.toString());
      image.setAttribute("height", qrSize.toString());
      image.setAttribute("x", "0");
      image.setAttribute("y", "0");
      image.setAttribute("href", canvas.toDataURL('image/png'));
      
      svg.appendChild(image);
      
      // Convert SVG to string
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      link.href = svgUrl;
      link.download = `synerharvest-batch-${batch?.batchCode || id}.svg`;
    }
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print the QR code
  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const trackingUrl = getTrackingUrl();
    const batchInfo = batch ? `
      <div style="margin-bottom: 20px; text-align: center;">
        <h2>SynerHarvest - Batch QR Code</h2>
        <p>Batch Code: ${batch.batchCode}</p>
        <p>Product: ${batch.productName}</p>
        <p>Production Date: ${new Date(batch.productionDate || '').toLocaleDateString()}</p>
        <p>URL: ${trackingUrl}</p>
      </div>
    ` : '';
    
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>SynerHarvest - Batch QR Code</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                .qr-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
                }
                .qr-image {
                  max-width: 300px;
                  max-height: 300px;
                }
                @media print {
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                ${batchInfo}
                <img src="${dataUrl}" alt="Batch QR Code" class="qr-image" />
                <p style="margin-top: 20px;">Scan to track this product's journey</p>
                <button class="no-print" style="margin-top: 20px; padding: 10px 20px;" onclick="window.print()">Print</button>
              </div>
            </body>
          </html>
        `);
        
        printWindow.document.close();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading batch details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          <div className="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="alert-content">{error}</div>
        </div>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/batches')}>
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="not-found-container">
        <h2>Batch not found</h2>
        <p>The batch you are looking for does not exist or has been removed.</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/batches')}>
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  const trackingUrl = getTrackingUrl();

  return (
    <div className="batch-qr-code-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Batch QR Code</h1>
            <p className="page-subtitle">
              QR Code for batch #{batch.batchCode}
            </p>
          </div>
          <div className="page-actions">
            <Link to={`/batches/${id}`} className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Batch Details
            </Link>
          </div>
        </div>
      </div>

      <div className="qr-code-container">
        <div className="qr-code-card">
          <div className="qr-code-header">
            <h2>Scan this QR code to track the product</h2>
            <p>
              This QR code points to <strong>{trackingUrl}</strong>
            </p>
          </div>
          
          <div className="qr-code-display" ref={qrRef}>
            <QRCodeGenerator
              value={trackingUrl}
              size={qrSize}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="qr-code-options">
            <div className="option-group">
              <label htmlFor="qr-size">QR Code Size:</label>
              <input
                type="range"
                id="qr-size"
                min="150"
                max="400"
                step="10"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
              />
              <span>{qrSize}px</span>
            </div>
            
            <div className="option-group">
              <label htmlFor="download-format">Download Format:</label>
              <select
                id="download-format"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'svg')}
              >
                <option value="png">PNG Image</option>
                <option value="svg">SVG Vector</option>
              </select>
            </div>
          </div>
          
          <div className="qr-code-actions">
            <button 
              className="btn btn-outlined" 
              onClick={downloadQRCode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download QR Code
            </button>
            
            <button 
              className="btn btn-outlined" 
              onClick={printQRCode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print QR Code
            </button>
          </div>
        </div>
        
        <div className="batch-info-card">
          <div className="card-header">
            <h3>Batch Information</h3>
          </div>
          <div className="card-content">
            <div className="info-item">
              <span className="info-label">Batch Code:</span>
              <span className="info-value">{batch.batchCode}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Product:</span>
              <span className="info-value">{batch.productName}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Production Date:</span>
              <span className="info-value">
                {batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Expiration Date:</span>
              <span className="info-value">
                {batch.expirationDate ? new Date(batch.expirationDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">
                <span className={`badge ${batch.status === 'RECALLED' ? 'badge-danger' : 'badge-primary'}`}>
                  {batch.status?.replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-actions">
              <Link to={`/batches/${id}`} className="btn btn-outlined">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Batch Details
              </Link>
              
              <Link to={`/batches/${id}/events`} className="btn btn-outlined">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                View Batch Events
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="usage-instructions card">
        <h3>How to Use This QR Code</h3>
        <ol>
          <li>
            <strong>Print and Attach:</strong> Print the QR code and affix it to product packaging or shipping containers.
          </li>
          <li>
            <strong>Share with Partners:</strong> Share this QR code with distributors, retailers, and other supply chain partners.
          </li>
          <li>
            <strong>Consumer Access:</strong> Consumers can scan this QR code to see the complete journey of the product from farm to shelf.
          </li>
          <li>
            <strong>Verification:</strong> Use this QR code for quick verification of product authenticity and tracking information.
          </li>
        </ol>
        
        <p className="note">
          <strong>Note:</strong> Test the QR code with different scanning apps to ensure compatibility.
        </p>
      </div>
    </div>
  );
};

export default BatchQRCodePage;