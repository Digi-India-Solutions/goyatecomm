"use client"; 

import { useEffect, useRef } from "react";
import bwipjs from "bwip-js";

const ISBNBarcode = ({ isbn }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isbn || isbn.length !== 13) return;

    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: "ean13",        
        text: isbn,         
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
    } catch (e) {
      console.error("Barcode generation error:", e);
    }
  }, [isbn]);

  return (
    <a
      href={`https://www.amazon.in/s?k=${isbn}`}
      target="_blank"
      rel="noreferrer"
    >
      <canvas ref={canvasRef} style={{ cursor: "pointer" }} />
    </a>
  );
};

export default ISBNBarcode;
