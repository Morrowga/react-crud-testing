import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import OrderDetail from '../components/OrderDetail';
import ConfirmDialog from '../components/ConfirmDialog';

export default function OrderContent(checkoutSuccess, isOrderOpen) {
    const [orders, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailCartOpen, setIsDetailCartOpen] = useState(false);
    const [orderProducts, setOrderProducts] = useState(null);
    const [isConfirmDialog, setIsConfirmDialog] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);

    const openConfirmDialog = (orderId) => {
        setCancelOrderId(orderId)
        setIsConfirmDialog(true);
    }

    const closeConfirmDialog = () => {
        setIsConfirmDialog(false);
    }

    const cancelOrder = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/orders/' + cancelOrderId);
            if(response.data.message === 'Order deleted successfully'){
                console.log('Orders deleted successfully:', response.data);
                setIsConfirmDialog(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting orders:', error.message);
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options); // Format date as "Mon, Jan 1, 2023"
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
        const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero if necessary
    
        return `${formattedDate} ${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    const openOrderDetail = (order) => {
        setIsDetailCartOpen(true);
        setOrderProducts(order)
    }

    const closeOrderDetail = () => {
        setIsDetailCartOpen(false);
        setOrderProducts(null)
    }
    

    const elements = Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
            <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 relative">
                    <Skeleton className="absolute inset-0 w-full h-full" count={1} /> 
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <a href='/#'>
                                <span aria-hidden="true" className="absolute inset-0" />
                            </a>
                        </h3>
                    </div>
                </div>
                <Skeleton height={30} count={1} /> 
            </div>
        </div>
    ));

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/orders?session_token=' + Cookies.get('session_token'));
        
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (!checkoutSuccess) {
            fetchData();
        }
    }, [checkoutSuccess, isOrderOpen]);

      if (isLoading) {
        return (
            <div className="bg-[#060505]">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {elements}
                    </div>
                </div>
            </div>
        )
      }
    
      if (error) {
        return (
            ''
        )
      }

    return (
      <div className="bg-[#060505] mx-5">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className='text-white text-left text-xl tracking-wide'>Your Orders</h1>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {orders.map((order) => (
              <div key={order._id} className="group relative">
                <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none h-80">
                    <img
                        src={process.env.PUBLIC_URL + '/productbg.jpg'}
                        alt={process.env.PUBLIC_URL + '/productbg.jpg'}
                        className="h-full w-full object-cover object-center lg:w-full"
                    />
                </div>
                <div className='absolute top-5 left-0 right-0 px-4 py-2'>
                    <p className="text-lg font-semibold text-gray-800">
                        Total Products
                    </p>
                    <p className="font-semibold text-gray-800 my-1">
                        <span className="text-big text-[#60d3f6]">{order.products.length}</span>
                    </p>
                    <div className='flex justify-between'>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                Total Qty
                            </p>
                            <p className="font-semibold text-gray-800">
                                <span className="text-big text-[#60d3f6]">{order.total_quantity}</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                Total Price
                            </p>
                            <p className="text-sm font-semibold text-gray-800 my-3">
                                <span className="text-big text-[#60d3f6]">${order.total_price}</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div className='absolute bottom-custom right-0 px-4 py-2 flex justify-between'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1 mx-1 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    <span className='text-gray-400'>
                        {formatDate(order.createdAt)}
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 px-4 py-2">
                    <button onClick={() => openOrderDetail(order)} className="w-full mt-2 px-4 py-2 bg-[#60d3f6] text-white rounded-md hover:bg-[#06b3d8] focus:outline-none focus:bg-[#06b3d8]">
                        View Details
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <OrderDetail  isDetailCartOpen={isDetailCartOpen} openConfirmDialog={openConfirmDialog} formatDate={formatDate} closeOrderDetail={closeOrderDetail} orderProducts={orderProducts} />
        {isConfirmDialog && <ConfirmDialog isConfirmDialog={isConfirmDialog} cancelOrder={cancelOrder} closeConfirmDialog={closeConfirmDialog} />}
      </div>
    )
  }
  