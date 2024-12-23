import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
function AddOrder() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [billMakerUsername, setBillMakerUsername] = useState("");
  const [billMakerRole, setBillMakerRole] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    // Fetch the login data from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUsername && storedRole) {
      setBillMakerUsername(storedUsername);
      setBillMakerRole(storedRole);
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.productID.toString().includes(query.trim())
    );
    setFilteredProducts(filtered);
  };

  const handleRowClick = (product) => {
    if (product.stock === 0) return; // Prevent adding out-of-stock products

    const existingProduct = selectedProducts.find(
      (p) => p.productID === product.productID
    );
    if (existingProduct) {
      if (existingProduct.quantity + 1 <= product.stock) {
        setSelectedProducts(
          selectedProducts.map((p) =>
            p.productID === product.productID
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        );
      } else {
        alert("Not enough stock available!");
      }
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromBilling = (product) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productID !== product.productID)
    );
  };

  const handleQuantityChange = (product, quantity) => {
    if (quantity < 1 || quantity > product.stock) return;
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productID === product.productID
          ? { ...p, quantity: Number(quantity) }
          : p
      )
    );
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const calculateTotalAmount = () => {
    const totalPrice = calculateTotalPrice();
    const tax = totalPrice * 0.18;
    return totalPrice + tax;
  };

  const calculateTotalQuantity = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  const generateBarcode = (billId) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, billId, {
      format: "CODE128",
      width: 2,
      height: 40,
    });
    return canvas.toDataURL("image/png");
  };

  const handleCheckout = async () => {
    if (!customerName || !billMakerUsername || !billMakerRole) {
      alert("Please provide all required fields (Customer Name, Bill Maker Username, and Bill Maker Role).");
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    setCurrentDateTime(formattedDate);

    const billData = {
      customerName,
      billMakerUsername,
      billMakerRole,
      products: selectedProducts,
      totalPrice: calculateTotalPrice(),
      totalAmount: calculateTotalAmount(),
      totalQuantity: calculateTotalQuantity(),
      dateTime: formattedDate,
    };

    try {
      // Send the bill data to the backend
      const response = await axios.post(`${apiUrl}/api/bills`, billData);
      const { billId } = response.data.bill;

      // Update stock for each product sold
      await Promise.all(
        selectedProducts.map((product) =>
          axios.post(`${apiUrl}/api/products/update-stock`, {
            productID: product.productID,
            quantitySold: product.quantity,
          })
        )
      );

      // Update the product list locally after checkout
      const updatedProducts = products.map((product) => {
        const purchasedProduct = selectedProducts.find(
          (p) => p.productID === product.productID
        );
        if (purchasedProduct) {
          return {
            ...product,
            stock: product.stock - purchasedProduct.quantity,
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      const doc = new jsPDF();
      const pageWidth = 4 * 25.4;
      doc.internal.pageSize.width = pageWidth;

      const barcodeDataUrl = generateBarcode(billId);

      doc.setFontSize(14);
      doc.text("Invoice", 10, 20);

      doc.setFontSize(10);
      doc.text(`Bill ID: ${billId}`, 10, 30);
      doc.text(`Customer Name: ${customerName}`, 10, 35);
      doc.text(`Bill Maker: ${billMakerUsername}`, 10, 40);
      doc.text(`Role: ${billMakerRole}`, 10, 45);
      doc.text(`Date: ${formattedDate}`, 10, 50);

      doc.addImage(barcodeDataUrl, "PNG", 10, 55, 80, 20);

      const headers = ["Product Name", "Quantity", "Price", "Total"];
      const tableData = selectedProducts.map((product) => [
        product.name,
        product.quantity,
        `$${product.price.toFixed(2)}`,
        `$${(product.price * product.quantity).toFixed(2)}`,
      ]);

      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 80,
        margin: { horizontal: 10 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fontStyle: "bold", fillColor: [22, 160, 133] },
        bodyStyles: { fontSize: 9 },
      });

      const yPosition = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Price: $${calculateTotalPrice().toFixed(2)}`, 10, yPosition);
      doc.text(`Tax (18%): $${(calculateTotalPrice() * 0.18).toFixed(2)}`, 10, yPosition + 5);
      doc.text(`Total Amount: $${calculateTotalAmount().toFixed(2)}`, 10, yPosition + 10);

      const pdfDataUri = doc.output("datauristring");
      window.open(pdfDataUri, "_blank");

      // alert("Bill saved successfully!");
      setSelectedProducts([]);
      setCustomerName("");
      setSearchQuery("");
      setCurrentDateTime("");
    } catch (error) {
      console.error("Error saving the bill:", error);
      alert("Error saving the bill.");
    }
  };

  const handleDiscardBill = () => {
    setSelectedProducts([]);
    setCustomerName("");
    setSearchQuery("");
    setCurrentDateTime("");
  };

  return (
    <div className="flex w-full h-screen bg-gray-700 text-white">
      <div className="w-full">
        <div className="flex w-full items-center justify-center font-[Orbitron] tracking-[16px] text-[4rem]">
          <h1>BILLING</h1>
        </div>
        <div className="flex w-full">
          {/* Sidebar */}
          <div className="w-[15%] bg-white"></div>

          {/* Product List Section */}
          <div className="w-[50%] flex bg-gray-800 flex-col items-center rounded-2xl py-[1.5rem] mr-8 ml-8 mb-8">
            <h1 className="text-[2rem] mb-[1rem] tracking-widest">Products List</h1>

            {/* Search Bar */}
            <div className="w-11/12 mb-4">
              <input
                type="text"
                placeholder="Search by Product ID"
                value={searchQuery}
                onChange={handleSearch}
                className="p-2 w-full bg-white text-black border rounded"
              />
            </div>

            {/* Products Table */}
            <table className="table-auto w-11/12 border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Product ID</th>
                  <th className="p-2 text-left">Stock</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.productID}
                    className={`cursor-pointer ${product.stock === 0 ? "opacity-50" : ""}`}
                    onClick={() => handleRowClick(product)}
                  >
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.productID}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRowClick(product)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Billing Section */}
          <div className="w-[35%] bg-gray-800 h-fit rounded-xl py-4 px-8">
            <div className="w-full flex justify-center align-center">
              <h1 className="text-2xl tracking-widest">Billing</h1>
            </div>
            <div className="mb-4">
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 mt-2 rounded border border-gray-400 bg-white text-black"
              />
            </div>

            {/* Bill Maker Info */}
            <div className="mb-4">
              <label>Bill Maker Username</label>
              <input
                type="text"
                value={billMakerUsername}
                readOnly
                className="w-full p-2 mt-2 rounded border border-gray-400 bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label>Bill Maker Role</label>
              <input
                type="text"
                value={billMakerRole}
                readOnly
                className="w-full p-2 mt-2 rounded border border-gray-400 bg-white text-black"
              />
            </div>

            {/* Selected Products List */}
            <h2 className="text-xl font-bold mb-2">Selected Products</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr
                    key={product.productID}
                    className={`text-gray-600 ${product.stock === 0 ? "opacity-50" : ""}`}
                  >
                    <td className="p-2 text-white">{product.name}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={product.quantity}
                        min="1"
                        max={product.stock}
                        onChange={(e) => handleQuantityChange(product, e.target.value)}
                        className="p-2 w-full bg-white text-black"
                      />
                    </td>
                    <td className="p-2 text-white">${product.price}</td>
                    <td className="p-2 text-white">${(product.price * product.quantity).toFixed(2)}</td>
                    <td className="p-2 text-white">
                      <button
                        onClick={() => handleRemoveFromBilling(product)}
                        className="text-white bg-red-500 px-[6px] py-[8px] rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="mt-4">
              <p>Subtotal: ${calculateTotalPrice().toFixed(2)}</p>
              <p>Tax (18%): ${(calculateTotalPrice() * 0.18).toFixed(2)}</p>
              <p>Total: ${calculateTotalAmount().toFixed(2)}</p>
            </div>

            {/* Checkout and Discard Bill Buttons */}
            <div className="mt-4 flex">
              <button
                onClick={handleCheckout}
                className="bg-indigo-600 text-white p-2 rounded-md w-full mr-2 hover:bg-indigo-700"
              >
                Checkout
              </button>
              <button
                onClick={handleDiscardBill}
                className="bg-red-500 text-white p-2 rounded-md w-full hover:bg-red-600"
              >
                Discard Bill
              </button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AddOrder;
