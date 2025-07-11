import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
  const modalRef = useRef();

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0); // small delay to avoid immediate close
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative"
      >
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button> */}

        <div className="mb-6">{children}</div>

        <div className="flex justify-center">
          <button
            onClick={onSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
