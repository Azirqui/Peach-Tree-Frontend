import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const UpdateSupplierForm = ({ supplier, onClose, fetchSuppliers }) => {
  const [updatedSupplier, setUpdatedSupplier] = useState(supplier);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true); // Track if modal is shown
  const formRef = useRef(null);

  useEffect(() => {
    setUpdatedSupplier(supplier);
  }, [supplier]);

  // Handle input changes for the supplier form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSupplier({ ...updatedSupplier, [name]: value });
  };

  // Handle form submission to update the supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the supplier's auto-generated ID for the update request
      await axios.put(`${apiUrl}/api/suppliers/update/${updatedSupplier.id}`.replace(/\/\//g, '/'), updatedSupplier);

      alert("Supplier updated successfully!");
      setLoading(false);

      // Fetch updated suppliers list
      fetchSuppliers();
      onClose(); // Close the modal after submitting
    } catch (err) {
      console.error("Error updating supplier:", err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false); // Hide the modal
    setTimeout(() => onClose(), 150); // Ensure the modal closes after transition
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose(); // Close the form
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 animation-fade-in">
      <div
        className="bg-gray-800 p-6 rounded-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
        ref={formRef}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Supplier</h2>
        <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-left text-white">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedSupplier.name}
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
              value={updatedSupplier.companyName}
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
              value={updatedSupplier.address}
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
              value={updatedSupplier.contact}
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
            {loading ? "Updating Supplier..." : "Update Supplier"}
          </button>
        </form>

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

export default UpdateSupplierForm;
