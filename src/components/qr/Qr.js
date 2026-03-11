import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  useEffect(() => {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      // Handle the decoded text
      console.log(`Scan result: ${decodedText}`, decodedResult);
      window.location.href = decodedText;

      // Note: window.open might be blocked by pop-up blockers, 
      // window.location.href is safer for navigation if the QR is a URL
      // or use specific logic if it's an ID
    };

    const qrCodeErrorCallback = (errorMessage) => {
      // parse error, ignore it.
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false);

    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return (
    <div className="w-full">
      <div id="qr-reader" className="overflow-hidden rounded-xl border-0 !bg-transparent"></div>
      <style jsx global>{`
                #qr-reader {
                    border: none !important;
                }
                #qr-reader__scan_region {
                    background: transparent !important;
                }
                #qr-reader__dashboard_section_csr button {
                    background: rgba(37, 99, 235, 0.9) !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-weight: 500 !important;
                    margin-top: 10px !important;
                }
                #qr-reader__dashboard_section_swaplink {
                    color: #60a5fa !important;
                    text-decoration: none !important;
                }
            `}</style>
    </div>
  );
};

export default QRScanner;
