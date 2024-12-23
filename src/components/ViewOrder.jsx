import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'; // For plus and minus icons
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const ViewOrder = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [openBillId, setOpenBillId] = useState(null); // To track the currently open bill

  // Retrieve the username from localStorage
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!username) {
          setError('No username found. Please log in again.');
          return;
        }

        // Fetch bills based on the username
        const response = await fetch(
          `${apiUrl}/api/bills?billMakerUsername=${encodeURIComponent(username)}`
        );

        // Debugging logs
        console.log('API Response Status:', response.status);

        const data = await response.json();
        console.log('Fetched data:', data);

        if (!response.ok) {
          setError(data.message || 'Failed to fetch bills.');
          return;
        }

        setBills(data); // Set the fetched bills in state
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('An error occurred while fetching bills.');
      }
    };

    fetchBills();
  }, [username]);

  const handleToggleDetails = (billId) => {
    // If the clicked bill is already open, close it; otherwise, open the clicked bill and close others
    setOpenBillId((prev) => (prev === billId ? null : billId));
  };

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">View Orders</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full flex text-white">
      <div className="w-[15%]"></div>
      <div className="w-[85%] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">View Orders</h1>
        <div className="grid grid-cols-1 w-11/12 gap-4">
          {bills.length > 0 ? (
            bills.map((bill) => (
              <div
                key={bill.billId} // Using billId as the key
                className="p-4 rounded-xl shadow-lg bg-gray-900 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{bill.customerName}</h2>
                  <p>Order ID: {bill.billId}</p>
                </div>
                <p>Bill Maker: {bill.billMakerUsername}</p>
                <p>Total Amount: ${bill.totalAmount}</p>
                <p>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>

                <button
                  onClick={() => handleToggleDetails(bill.billId)}
                  className="mt-4 text-blue-500 hover:underline"
                >
                  {openBillId === bill.billId ? (
                    <AiOutlineMinus size={20} />
                  ) : (
                    <AiOutlinePlus size={20} />
                  )}
                </button>

                <div
                  className={`mt-4 overflow-hidden transition-all duration-700 ${
                    openBillId === bill.billId ? 'max-h-screen' : 'max-h-0'
                  }`}
                >
                  <h3 className="font-semibold">Products</h3>
                  <ul>
                    {bill.products.map((product, index) => (
                      <li key={index} className="mb-2">
                        <p>Product Name: {product.name}</p>
                        <p>Product ID: {product.productID}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <p>Total Quantity: {bill.totalQuantity}</p>
                    <p>Total Price: ${bill.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bills available for this user.</p>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default ViewOrder;
