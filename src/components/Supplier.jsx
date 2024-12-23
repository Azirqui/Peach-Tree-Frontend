import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding } from "react-icons/fa";
import AddSupplierForm from "./AddSupplierForm";
import UpdateSupplierForm from "./UpdateSupplierForm";
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch all suppliers from the backend
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/suppliers`.replace(/\/\//g, '/'));
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplierId) => {
    const supplierToEdit = suppliers.find(supplier => supplier.id === supplierId);
    setSelectedSupplier(supplierToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`${apiUrl}/api/suppliers/delete/${supplierId}`.replace(/\/\//g, '/'));
      setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));  // Update UI
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  // Close modals when clicked outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-[15%]"></div>
      <div className="container mx-auto p-4 bg-gray-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Suppliers</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaBuilding className="inline mr-2" />
            Add Supplier
          </button>
        </div>

        {/* Suppliers Table */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border-b text-left">Supplier ID</th>
              <th className="p-2 border-b text-left">Name</th>
              <th className="p-2 border-b text-left">Company Name</th>
              <th className="p-2 border-b text-left">Address</th>
              <th className="p-2 border-b text-left">Contact</th>
              <th className="p-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="bg-gray-600">
                <td className="p-2 border-b">{supplier.id}</td>
                <td className="p-2 border-b">{supplier.name}</td>
                <td className="p-2 border-b">{supplier.companyName}</td>
                <td className="p-2 border-b">{supplier.address}</td>
                <td className="p-2 border-b">{supplier.contact}</td>
                <td className="p-2 border-b text-center">
                  <button
                    onClick={() => handleEdit(supplier.id)}
                    className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Add Supplier */}
        {isAddModalOpen && (
          <div
            className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-700"
            onClick={handleOutsideClick}
          >
            <AddSupplierForm onClose={() => setIsAddModalOpen(false)} fetchSuppliers={fetchSuppliers} />
          </div>
        )}

        {/* Modal for Edit Supplier */}
        {isEditModalOpen && selectedSupplier && (
          <div
            className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-700"
            onClick={handleOutsideClick}
          >
            <UpdateSupplierForm
              supplier={selectedSupplier}
              onClose={() => setIsEditModalOpen(false)}
              fetchSuppliers={fetchSuppliers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Supplier;
