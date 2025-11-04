import React, { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// We must explicitly list all formats to fix the "No MultiFormat Readers" error.
const formatsToSupport = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.MAXICODE,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.RSS_14,
  Html5QrcodeSupportedFormats.RSS_EXPANDED,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
];

/**
 * Renders the barcode scanner interface.
 * @param {object} props
 * @param {function} props.onScanSuccess - Callback function when a scan is successful.
 * @param {function} props.onReset - Callback function to cancel scanning and go back.
 */
export default function ProductScanner({ onScanSuccess, onReset }) {

  useEffect(() => {
    const config = {
      fps: 10,
      // This is the key: The library will now create a 350px x 150px
      // "window" and dim the rest of the screen. This is the accurate viewfinder.
      qrbox: { width: 350, height: 150 }, 
      
      formatsToSupport: formatsToSupport, // Fixes the MultiFormat error
      facingMode: "environment",
      rememberLastUsedCamera: true,
    };

    const scanner = new Html5QrcodeScanner(
      'reader', 
      config,
      false // verbose
    );

    let hasScanned = false;

    function successCallback(decodedText, decodedResult) {
      if (!hasScanned) {
        hasScanned = true;
        console.log(`Barcode scanned: ${decodedText}`);
        try {
          if (navigator.vibrate) navigator.vibrate(100);
        } catch (e) { console.warn("Vibration not supported"); }
        
        scanner.clear();
        
        setTimeout(() => {
          onScanSuccess(decodedText);
        }, 200);
      }
    }

    function errorCallback(errorMessage) {
      // Safely ignore errors
    }

    scanner.render(successCallback, errorCallback);

    return () => {
      // Ensure scanner.clear() is called only if scanner is active
      if (scanner && scanner.getState() === "SCANNING") {
        scanner.clear().catch(error => {
          console.error("Failed to clear scanner on unmount", error);
        });
      }
    };
  }, [onScanSuccess]); // Add onScanSuccess to dependency array

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Scan Product Barcode</h2>
      <p className="text-center text-gray-600 mb-6">
        Place the barcode inside the scanner window.
      </p>
      
      {/* --- THIS IS THE UI FIX ---
        We no longer need any custom CSS overlays (no red line, no brackets).
        The 'html5-qrcode' library will render its own viewfinder
        (a dimmed overlay with a clear box) inside the 'reader' div.
      */}
      <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden shadow-inner border border-gray-300">
        <div id="reader" className="w-full h-full"></div>
      </div>
      {/* --- END OF UI FIX --- */}

      <button 
        onClick={onReset}
        className="w-full mt-6 flex items-center justify-center bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Cancel
      </button>
    </div>
  );
}