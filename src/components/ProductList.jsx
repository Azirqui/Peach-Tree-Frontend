import React, { useState } from 'react';
import axios from 'axios';
import EditProductForm from './EditProductForm';
import AddProduct from '../components/AddProduct';
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const ProductList = ({ products = [], setProducts }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to handle product deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/products/${id}`);
      const updatedProducts = products.filter((product) => product.productID !== id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to handle product edit
  const handleEdit = (product) => {
    setEditingProduct(product); // Open the edit form for the selected product
  };

  // Handle save after editing a product
  const handleSave = async (updatedProduct) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/products/${updatedProduct.productID}`,
        updatedProduct
      );

      console.log('Product updated:', response.data);

      // Update product list state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productID === updatedProduct.productID ? response.data : product
        )
      );

      setEditingProduct(null); // Close the edit form
    } catch (error) {
      console.error('Error updating product:', error.response || error.message);
    }
  };

  // Handle cancel of editing
  const handleCancel = () => {
    setEditingProduct(null); // Close the edit form
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProductAdded = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products`);
      setProducts(response.data); // Update the product list after adding a product
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const cleanProductData = (product) => {
    const { _id, __v, ...cleanedProduct } = product;
    return cleanedProduct;
  };

  return (
    <div className="bg-gray-900 ml-8 p-6 text-white w-full rounded-3xl max-w-7xl mx-auto">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSave={handleSave} // Pass handleSave here
          onCancel={handleCancel}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {showModal && (
        <AddProduct
          onProductAdded={handleProductAdded}
          onClose={handleCloseModal}
        />
      )}

      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2 flex justify-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const cleanedProduct = cleanProductData(product);
            return (
              <tr 
                key={cleanedProduct.productID}
                className={`${product.stock === 0 ? "opacity-50" : ""} `}
                >
                <td className="border px-4 py-2">{cleanedProduct.productID}</td>
                <td className="border px-4 py-2">{cleanedProduct.name}</td>
                <td className="border px-4 py-2">${cleanedProduct.price}</td>
                <td className="border px-4 py-2">{cleanedProduct.company}</td>
                <td className="border px-4 py-2">{cleanedProduct.stock}</td>
                <td className="border px-4 py-2 flex justify-center items-center">
                  <button
                    onClick={() => handleEdit(cleanedProduct)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(cleanedProduct.productID)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
