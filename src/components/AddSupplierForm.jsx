import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const AddSupplierForm = ({ onClose, fetchSuppliers }) => {
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    companyName: "",
    address: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(""); // State for success message
  const [warning, setWarning] = useState(""); // State for warning message
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setWarning("");

    try {
      // Send the data to the backend to create the supplier
      await axios.post(`${apiUrl}/api/suppliers/add`.replace(/\/\//g, '/'), newSupplier);

      setSuccess("Supplier added successfully!");
      setLoading(false);

      // Fetch updated suppliers list
      fetchSuppliers();
      onClose(); // Close the modal after submitting

      // Reset the form
      setNewSupplier({
        name: "",
        companyName: "",
        address: "",
        contact: "",
      });
    } catch (err) {
      console.error("Error adding supplier:", err);
      setWarning("Failed to add supplier. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 animation-fade-in">
      <div
        className="bg-gray-800 p-6 rounded-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
        ref={formRef}
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Supplier</h2>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-left text-white">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full border rounded-md text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="companyName" className="block text-lg font-medium text-left text-white">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={newSupplier.companyName}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full border rounded-md text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium text-left text-white">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newSupplier.address}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full border rounded-md text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact" className="block text-lg font-medium text-left text-white">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={newSupplier.contact}
              onChange={handleInputChange}
              required
              className="mt-2 p-2 w-full border rounded-md text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Adding Supplier..." : "Add Supplier"}
          </button>
        </form>

        {success && <p className="mt-4 text-green-500">{success}</p>}
        {warning && <p className="mt-4 text-red-500">{warning}</p>}

        <button
          onClick={handleClose}
          className="mt-4 w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddSupplierForm;
