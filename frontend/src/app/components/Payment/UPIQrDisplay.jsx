import React from "react";
import QRCode from "react-qr-code";

function generateUPILink({ upiId, name, amount }) {
  let link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`;
  if (amount) {
    link += `&am=${amount}`;
  }
  return link;
}


const UPIQrDisplay = ({
  upiId = "GOYATTRADINGCO@rbl",
  name = "GOYAT TRADING CO",
  amount,
}) => {
  const upiLink = generateUPILink({ upiId, name, amount });

  return (
    <div className="p-6 border rounded-lg bg-white flex items-center flex-col ">
      <h2 className="text-lg text-green-500 font-bold mb-2">Scan to Pay</h2>
      <QRCode value={upiLink} size={220} />
      <p className="mt-2 text-sm text-gray-600">{name}</p>
      <p className="text-gray-800 font-medium">{upiId}</p>
      {amount && <p className="text-green-600">Amount: ₹{amount}</p>}
    </div>
  );
};

export default UPIQrDisplay;
