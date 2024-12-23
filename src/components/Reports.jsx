import React, { useState, useEffect } from 'react';
import '../css/Reports.css';
import {
  getSalesByMonth,
  getSalesByYear,
  getTopSellingProducts,
  getSalesByCategory,
  getCustomSalesTrends,
} from '../services/api';

const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [salesByYear, setSalesByYear] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [customTrends, setCustomTrends] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  useEffect(() => {
    fetchSalesByMonth(year);
    fetchSalesByYear();
    fetchTopSellingProducts();
    fetchSalesByCategory();
  }, [year]);

  const fetchSalesByMonth = async (year) => {
    const { data } = await getSalesByMonth(year);
    setSalesByMonth(data);
  };

  const fetchSalesByYear = async () => {
    const { data } = await getSalesByYear();
    setSalesByYear(data);
  };

  const fetchTopSellingProducts = async () => {
    const { data } = await getTopSellingProducts();
    setTopProducts(data);
  };

  const fetchSalesByCategory = async () => {
    const { data } = await getSalesByCategory();
    setSalesByCategory(data);
  };

  const fetchCustomTrends = async () => {
    const { data } = await getCustomSalesTrends(startDate, endDate);
    setCustomTrends(data);
  };

  return (
    <div className="reports">
      <h1>Sales Reports</h1>

      <div className="report-section">
        <h2>Sales by Month</h2>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter Year"
        />
        <ul>
          {salesByMonth.map((month) => (
            <li key={month._id}>
              Month {month._id}: ${month.totalSales}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Sales by Year</h2>
        <ul>
          {salesByYear.map((year) => (
            <li key={year._id}>
              Year {year._id}: ${year.totalSales}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Top-Selling Products</h2>
        <ul>
          {topProducts.map((product) => (
            <li key={product._id}>
              Product ID {product._id}: {product.totalQuantity} units sold
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Sales by Category</h2>
        <ul>
          {salesByCategory.map((category) => (
            <li key={category._id}>
              Category {category._id}: ${category.totalSales}
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Custom Sales Trends</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <button onClick={fetchCustomTrends}>Get Trends</button>
        <ul>
          {customTrends.map((trend) => (
            <li key={trend._id}>
              Day {trend._id}: ${trend.totalSales}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
