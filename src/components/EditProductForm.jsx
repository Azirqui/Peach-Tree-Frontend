import React, { useState, useEffect } from 'react';

const EditProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    price: product.price || '',
    stock: '',
  });

  useEffect(() => {
    setFormData({
      price: product.price || '',
      stock: '',
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      price: formData.price,
      stock: parseInt(formData.stock || 0), // Pass only the incremental stock
    };
  
    onSave(updatedProduct);
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-lg w-1/3 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Edit Product</h2>
        <div className="mb-4">
          <label className="block mb-1 text-white">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
