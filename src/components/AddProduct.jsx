
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/AddProduct.css'; // Importing sidebar.css
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const AddProduct = ({ onProductAdded, onClose }) => {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [company, setCompany] = useState('');
  const [stock, setStock] = useState('');
  const [supplierID, setSupplierID] = useState('');
  const [supplierOptions, setSupplierOptions] = useState([]); // Changed to dynamic
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const formRef = useRef(null);

    // Fetch supplier IDs from backend
    useEffect(() => {
      const fetchSuppliers = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/suppliers`); // Replace with your actual endpoint
          const suppliers = response.data.map((supplier) => supplier.id); // Assuming supplier objects have an `id` field
          setSupplierOptions(suppliers);
        } catch (error) {
          console.error('Error fetching suppliers:', error);
          setWarning('Failed to fetch supplier IDs. Please try again.');
        }
      };
  
      fetchSuppliers();
    }, []);

  // Function to generate productID in the format "XXXX-YYYYYY"
  const generateProductID = () => {
    const letters = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random uppercase letters
    const digits = Math.random().toString().slice(2, 8); // 6 random digits
    return `${letters}-${digits}`;
  };

  // Automatically generate productID on mount
  useEffect(() => {
    const newProductID = generateProductID();
    setProductID(newProductID);
  }, []); // Empty dependency array to run only on component mount

  // Function to handle resetting the form
  const handleReset = () => {
    setProductID(generateProductID());  // Generate new ID on reset
    setProductName('');
    setPrice('');
    setCompany('');
    setStock('');
    setSupplierID('');
    setWarning('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure all required fields are included
    if (!productID || !productName || !price || !company || !stock || !supplierID) {
      setWarning('Please fill in all required fields.');
      return;
    }

    const newProduct = {
      productID: productID, // Include productID in the payload
      name: productName,    // Match the backend's required field names
      price: price,
      company: company,
      stock: stock,
      supplierID: supplierID,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/products`, newProduct);
      console.log('Product added successfully', response);
      setSuccess('Product added successfully');
      onProductAdded(); // Trigger onProductAdded callback if needed
      handleReset();    // Reset the form after successful submission
    } catch (error) {
      console.error('Error saving product:', error);
      setWarning('Failed to add product. Please try again.');
    }
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 animation-fade-in">
      <div
        ref={formRef}
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-out scale-100 animation-slide-up"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-white">Add Product</h3>
          <button onClick={() => { setProductID(''); onClose(); }} className="text-white text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Product ID Field */}
          <div className="mb-4 animation-fade-in">
            <label htmlFor="productID" className="block text-white">Product ID</label>
            <input
              type="text"
              id="productID"
              value={productID}
              onChange={(e) => setProductID(e.target.value)} // You can still change it manually if needed
              className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
              disabled
            />
          </div>

          {/* Other Fields */}
          <div className="mb-4 animation-fade-in">
            <label htmlFor="productName" className="block text-white">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4 animation-fade-in">
            <label htmlFor="price" className="block text-white">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4 animation-fade-in">
            <label htmlFor="company" className="block text-white">Company</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4 animation-fade-in">
            <label htmlFor="stock" className="block text-white">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4 animation-fade-in">
          <label htmlFor="supplierID" className="block text-white">Supplier ID</label>
            <select
              id="supplierID"
              value={supplierID}
              onChange={(e) => setSupplierID(e.target.value)}
              className="w-full cursor-pointer p-2 mt-2 bg-gray-800 text-white border border-gray-700 rounded"
            >
              <option value="">Select Supplier ID</option>
              {supplierOptions.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <input
              type="submit"
              value="Add Product"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer py-2 px-4 rounded-lg transition-transform transform hover:scale-105 animation-fade-in"
            />
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105 animation-fade-in"
            >
              Reset
            </button>
          </div>
        </form>

        {warning && (
          <p className="mt-4 text-red-500 animation-fade-in">
            {warning}
          </p>
        )}
        {success && (
          <p className="mt-4 text-green-500 animation-fade-in">
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
