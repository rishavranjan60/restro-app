import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Bill: React.FC = () => {
  const billRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!billRef.current) return;

    const canvas = await html2canvas(billRef.current);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(data, "PNG", 10, 10, 190, 0);
    pdf.save("Bill.pdf");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧾 Bill View</h2>

      <div ref={billRef} className="bg-white text-black p-4 rounded">
        <p>Customer: Test User</p>
        <p>Table: 2</p>
        <ul className="mt-2 list-disc ml-4">
          <li>Biryani - 1 × 300 = Rs. 300</li>
          <li>MoMo - 2 × 250 = Rs. 500</li>
        </ul>
        <p className="mt-2">Discount: Rs. 100</p>
        <p className="font-bold">Total: Rs. 700</p>
      </div>

      <button
        onClick={generatePDF}
        className="mt-4 bg-red-500 px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Bill;
