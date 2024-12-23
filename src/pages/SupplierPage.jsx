import React from 'react'
import Supplier from '../components/Supplier'
import { Outlet } from 'react-router-dom'

function SupplierPage() {
  return (
    <div>
        <div>
            <Supplier />
        </div>
      <Outlet />
    </div>
  )
}

export default SupplierPage
