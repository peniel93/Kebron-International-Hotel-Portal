import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { X, Printer, Download, FileText } from 'lucide-react';

export const ReceiptModal = ({ reservation, additionalServices = [], isOpen, onClose }) => {
  const receiptRef = useRef();

  if (!isOpen || !reservation) return null;

  const isOnlineOrder = !!reservation.order_code || !!reservation.item_title;
  const refCode = reservation.order_code || reservation.booking_code || 'N/A';

  const roomRate = reservation.unit_price || reservation.room_price || (reservation.total_amount / (reservation.days_count || 1));
  const days = isOnlineOrder ? (reservation.quantity || 1) : (reservation.days_count || 1);
  const itemTotal = reservation.total_amount || (roomRate * days);

  const servicesTotal = additionalServices.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  const grandTotal = itemTotal + servicesTotal;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Kebron_Receipt_${refCode}.pdf`);
  };

  const handleDownloadWord = () => {
    const textContent = `
============================================================
           KEBRON INTERNATIONAL HOTEL RECEIPT
============================================================
Reference Code: ${refCode}
Date: ${new Date().toLocaleDateString()}
Customer Name: ${reservation.customer_name}
Email: ${reservation.customer_email || reservation.email || 'N/A'}
Phone: ${reservation.customer_phone || reservation.phone || 'N/A'}

------------------------------------------------------------
ITEMIZED SERVICES & CALCULATIONS:
------------------------------------------------------------
${isOnlineOrder ? `
1. Online Item Order:
   - Item: ${reservation.item_title}
   - Category: ${reservation.item_category || 'Food & Beverage'}
   - Quantity: ${reservation.quantity || 1}
   - Unit Price: ${(reservation.unit_price || 0).toLocaleString()} ETB
   - Total Amount: ${(reservation.total_amount || 0).toLocaleString()} ETB
   - Delivery Location: ${reservation.delivery_location || 'Standard'}
   - Order Notes: ${reservation.order_notes || 'None'}
` : `
1. Room Reservation:
   - Type: ${reservation.room_type} (Room #${reservation.room_number || 'N/A'})
   - Days Stayed: ${days} Night(s)
   - Nightly Rate: ${roomRate.toLocaleString()} ETB
   - Room Total: ${itemTotal.toLocaleString()} ETB
`}

${additionalServices.length > 0 
  ? `2. Additional Services:\n` + additionalServices.map(s => `   - ${s.title}: ${s.qty || 1} x ${s.price} ETB = ${(s.price * (s.qty || 1)).toLocaleString()} ETB`).join('\n') 
  : ''}

------------------------------------------------------------
GRAND TOTAL PAID: ${grandTotal.toLocaleString()} ETB
Payment Bank Account: ${reservation.payment_bank || 'Bank Transfer'}
Payment Status: ${reservation.status || 'PAID & CONFIRMED'}
============================================================
    `;
    const blob = new Blob([textContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${refCode}.doc`;
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 max-w-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">
            <FileText className="w-6 h-6" />
            <span>{isOnlineOrder ? 'Online Order Invoice & Receipt' : 'Customer Invoice & Payment Receipt'}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div ref={receiptRef} id="printable-receipt" className="p-6 bg-white text-slate-900 my-4 rounded-xl border border-slate-200 shadow-sm">
          {/* Receipt Ethiopian Colors Top Stripe */}
          <div className="ethiopian-pattern-bar mb-4"></div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                KEBRON INTERNATIONAL HOTEL
              </h2>
              <p className="text-xs text-slate-500">Hawassa / Addis Ababa, Ethiopia</p>
              <p className="text-xs text-slate-500">Phone: +251 911 234 567 | Info@kebronhotel.com</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1">
                {reservation.status || 'PAID & APPROVED'}
              </span>
              <p className="text-xs font-mono font-bold text-slate-700">
                Code: {refCode}
              </p>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
            <div>
              <p className="text-slate-500 font-medium">Billed To:</p>
              <p className="font-bold text-slate-800">{reservation.customer_name}</p>
              <p>{reservation.customer_email || reservation.email || 'N/A'}</p>
              <p>{reservation.customer_phone || reservation.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">{isOnlineOrder ? 'Order Information:' : 'Stay Details:'}</p>
              {isOnlineOrder ? (
                <>
                  <p><span className="font-semibold">Item:</span> {reservation.item_title}</p>
                  <p><span className="font-semibold">Category:</span> {reservation.item_category || 'Meal'}</p>
                  <p><span className="font-semibold">Delivery:</span> {reservation.delivery_location || 'Standard'}</p>
                  {reservation.order_notes && <p><span className="font-semibold">Notes:</span> {reservation.order_notes}</p>}
                </>
              ) : (
                <>
                  <p><span className="font-semibold">Room Type:</span> {reservation.room_type}</p>
                  <p><span className="font-semibold">Room No:</span> #{reservation.room_number || '101'}</p>
                  <p><span className="font-semibold">Duration:</span> {days} Days</p>
                </>
              )}
            </div>
          </div>

          {/* Table Breakdown */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-slate-700">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-center">{isOnlineOrder ? 'Quantity' : 'Qty / Days'}</th>
                <th className="py-2 px-3 text-right">Unit Price</th>
                <th className="py-2 px-3 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 font-semibold">
                  {isOnlineOrder ? reservation.item_title : `${reservation.room_type} Room Rent`}
                </td>
                <td className="py-2 px-3 text-center">{days}</td>
                <td className="py-2 px-3 text-right">{roomRate.toLocaleString()} ETB</td>
                <td className="py-2 px-3 text-right font-bold">{itemTotal.toLocaleString()} ETB</td>
              </tr>
              {additionalServices.map((srv, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3">{srv.title}</td>
                  <td className="py-2 px-3 text-center">{srv.qty || 1}</td>
                  <td className="py-2 px-3 text-right">{srv.price.toLocaleString()} ETB</td>
                  <td className="py-2 px-3 text-right font-semibold">{(srv.price * (srv.qty || 1)).toLocaleString()} ETB</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3">
            <div className="text-xs text-slate-500">
              <p>Payment Account: {reservation.payment_bank || 'Bank Transfer'}</p>
              <p>Thank you for choosing Kebron International Hotel!</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold">Grand Total Amount</p>
              <p className="text-xl font-black text-amber-600">
                {grandTotal.toLocaleString()} ETB
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-900"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-red-700"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleDownloadWord}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            <span>Export Word</span>
          </button>
        </div>

      </div>
    </div>
  );
};

