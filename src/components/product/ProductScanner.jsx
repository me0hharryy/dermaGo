import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ProductScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader', // ID of the div element
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10, // Frames per second
      },
      false // verbose
    );

    let hasScanned = false;

    function successCallback(decodedText, decodedResult) {
      if (!hasScanned) {
        hasScanned = true; // Prevent multiple scans
        scanner.clear(); // Stop scanning
        onScanSuccess(decodedText);
      }
    }

    function errorCallback(errorMessage) {
      // Errors are expected, just log them
      // console.warn(errorMessage);
    }

    scanner.render(successCallback, errorCallback);

    // Cleanup function to clear the scanner when the component unmounts
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear scanner on unmount", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">Scan Product Barcode</h2>
      <p className="text-center text-brand-text-light mb-4">
        Center the product's barcode in the box below. We'll look it up and analyze the ingredients for you.
      </p>
      {/* This div is where the scanner will be rendered */}
      <div id="reader" className="w-full"></div>
    </div>
  );
}