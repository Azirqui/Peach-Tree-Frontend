// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import "chart.js/auto";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     PointElement,
//     LineElement,
//     ArcElement,
//   } from 'chart.js';
  
//   ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     PointElement,
//     LineElement,
//     ArcElement
//   );

// const Reports = () => {
//   const [monthlySales, setMonthlySales] = useState([]);
//   const [yearlySales, setYearlySales] = useState([]);
//   const [bestSellingProducts, setBestSellingProducts] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [salesByCategory, setSalesByCategory] = useState([]);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const currentYear = new Date().getFullYear();
//         const monthly = await axios.get(`/api/reports/sales-by-month/${currentYear}`);
//         //const monthly = await axios.get("/api/reports/sales-by-month/2024");
//         setMonthlySales(monthly.data);

//         const yearly = await axios.get("/api/reports/sales-by-year");
//         setYearlySales(yearly.data);

//         const bestSelling = await axios.get("/api/reports/top-selling-products");
//         setBestSellingProducts(bestSelling.data);

//         const lowStock = await axios.get("/api/inventory/low-stock-products");
//         setLowStockProducts(lowStock.data);

//         const categorySales = await axios.get("/api/reports/sales-by-category");
//         setSalesByCategory(categorySales.data);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       }
//     };

//     fetchReports();
//   }, []);

//   const monthlySalesData = {
//     labels: monthlySales.map((data) => data.month),
//     datasets: [
//       {
//         label: "Monthly Sales",
//         data: monthlySales.map((data) => data.totalSales),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const yearlySalesData = {
//     labels: yearlySales.map((data) => data.year),
//     datasets: [
//       {
//         label: "Yearly Sales",
//         data: yearlySales.map((data) => data.totalSales),
//         backgroundColor: "rgba(153, 102, 255, 0.6)",
//         borderColor: "rgba(153, 102, 255, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const categorySalesData = {
//     labels: salesByCategory.map((data) => data.category),
//     datasets: [
//       {
//         label: "Sales by Category",
//         data: salesByCategory.map((data) => data.totalSales),
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <Container>
//       <h1 className="text-center my-4">Sales Reports</h1>
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Monthly Sales</Card.Title>
//               <Bar data={monthlySalesData} />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Yearly Sales</Card.Title>
//               <Line data={yearlySalesData} />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Sales by Category</Card.Title>
//               <Pie data={categorySalesData} />
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Best Selling Products</Card.Title>
//               <ul>
//                 {bestSellingProducts.map((product, index) => (
//                   <li key={index}>
//                     {product.name} - {product.totalSold} sold
//                   </li>
//                 ))}
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Low Stock Products</Card.Title>
//               <ul>
//                 {lowStockProducts.map((product, index) => (
//                   <li key={index}>
//                     {product.name} - {product.stock} left
//                   </li>
//                 ))}
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Reports;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "chart.js/auto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Reports = () => {
  // State to store report data
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const currentYear = new Date().getFullYear();

        // Make API calls to fetch data
        const [monthly, yearly, bestSelling, lowStock, categorySales] = await Promise.all([
          axios.get(`/api/reports/sales-by-month/${currentYear}`),
          axios.get("/api/reports/sales-by-year"),
          axios.get("/api/reports/top-selling-products"),
          axios.get("/api/inventory/low-stock-products"),
          axios.get("/api/reports/sales-by-category"),
        ]);

        // Set state with API responses (ensuring they are arrays)
        setMonthlySales(Array.isArray(monthly.data) ? monthly.data : []);
        setYearlySales(Array.isArray(yearly.data) ? yearly.data : []);
        setBestSellingProducts(Array.isArray(bestSelling.data) ? bestSelling.data : []);
        setLowStockProducts(Array.isArray(lowStock.data) ? lowStock.data : []);
        setSalesByCategory(Array.isArray(categorySales.data) ? categorySales.data : []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Chart data configurations
  const monthlySalesData = {
    labels: monthlySales.map((data) => data.month),
    datasets: [
      {
        label: "Monthly Sales",
        data: monthlySales.map((data) => data.totalSales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const yearlySalesData = {
    labels: yearlySales.map((data) => data.year),
    datasets: [
      {
        label: "Yearly Sales",
        data: yearlySales.map((data) => data.totalSales),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const categorySalesData = {
    labels: salesByCategory.map((data) => data.category),
    datasets: [
      {
        label: "Sales by Category",
        data: salesByCategory.map((data) => data.totalSales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="bg-slate-100">
      <h1 className="text-center my-4">Sales Reports</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Sales</Card.Title>
              <Bar data={monthlySalesData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Yearly Sales</Card.Title>
              <Line data={yearlySalesData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Sales by Category</Card.Title>
              <Pie data={categorySalesData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Best Selling Products</Card.Title>
              <ul>
                {bestSellingProducts.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.totalSold} sold
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Low Stock Products</Card.Title>
              <ul>
                {lowStockProducts.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.stock} left
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
