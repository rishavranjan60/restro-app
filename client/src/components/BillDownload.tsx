import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CartItem } from "../types/types";

interface Props {
  cart: CartItem[];
  total: number;
}

const BillDownload: React.FC<Props> = ({ cart, total }) => {
  const billRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!billRef.current) return;

    const canvas = await html2canvas(billRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("Bill.pdf");
  };

  return (
    <>
      <div ref={billRef} className="bg-white text-black p-4 mt-4 rounded">
        <h2 className="text-xl font-bold">Order Bill</h2>
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              {item.name} - Rs. {item.price} x {item.cartQuantity} = Rs. {item.price * item.cartQuantity}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-bold">Total: Rs. {total}</p>
      </div>
      <button onClick={downloadPDF} className="bg-red-500 mt-2 px-4 py-2 rounded">
        ⬇️ Download Bill
      </button>
    </>
  );
};

export default BillDownload;
