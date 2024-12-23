import React from 'react';
import ViewOrder from '../components/ViewOrder';
import { Outlet } from 'react-router-dom';
function OrderView() {
  return (
    <div>
      <ViewOrder />
      {/* <Outlet /> */}
    </div>
  )
}

export default OrderView
