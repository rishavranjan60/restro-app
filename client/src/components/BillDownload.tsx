import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CartItem } from "../types/types";

interface Props {
  cart: CartItem[];
  total: number;
  name: string;
  phone: string;
  table: string;
}

const BillDownload: React.FC<Props> = ({ cart, total, name, phone, table }) => {
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
        <h2 className="text-xl font-bold mb-2"> Order Bill</h2>

        {/*  Customer Details */}
        <div className="mb-3">
          <p><strong>Customer:</strong> {name}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Table:</strong> {table}</p>
        </div>

        {/*  Dashed Line Separator */}
        <hr className="border-t border-dashed border-gray-500 my-2" />

        <h3 className="font-semibold">Items:</h3>
        <ul className="list-decimal pl-5">
          {cart.map((item) => (
            <li key={item._id || item.id}>
              {item.name} - €{item.price} × {item.cartQuantity} = €
              {item.price * item.cartQuantity}
            </li>
          ))}
        </ul>

        <hr className="border-t border-dashed border-gray-500 my-3" />

        <p className="mt-3 font-bold text-lg">Total: €{total}</p>
      </div>

      <button
        onClick={downloadPDF}
        className="bg-red-500 mt-2 px-4 py-2 rounded hover:bg-red-600"
      >
         Download Bill
      </button>
    </>
  );
};

export default BillDownload;
