// src/components/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import EditProductForm from '../components/EditProductForm';
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle editing a product
  const handleEdit = (product) => {
    setEditProduct(product); // Set the product to be edited
  };

  // Handle updating the product in the database
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`${apiUrl}/api/products/${updatedProduct.id}`, updatedProduct);
      console.log(response.data.message); // Log success message if needed

      // Update the product in the frontend state
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );

      // Close the edit modal
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="flex justify-center bg-gray-700 text-white mt-[3%] relative">
      <div className="w-full max-w-screen-lg"> {/* Full width up to a max width */}
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          <ProductList products={products} setProducts={setProducts} onEdit={handleEdit} />
        </div>

        {/* Modal for editing a product */}
        {editProduct && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 transition-opacity opacity-100"
            onClick={() => setEditProduct(null)} // Close modal when clicking outside the form
          >
            <div
              className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md transform scale-95"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
            >
              <EditProductForm
                product={editProduct}
                onUpdateProduct={handleUpdateProduct}
                onCancel={() => setEditProduct(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
