import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Button from '../components/Button'
import axios from 'axios';
  
export default function ProductContent({addToCart,isAdded}) {
    const [products, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const skeletons = Array.from({ length: 4 }, (_, index) => (
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

    useEffect(() => {
      console.log("Fetching products...");
  
        const fetchProducts = async () => {
          try {
              const response = await axios.get('http://localhost:3000/products');
          
              setData(response.data);
                setIsLoading(false);
          } catch (error) {
                setError(error.message);
                setIsLoading(false);
          }
        };
    
        fetchProducts();
    }, []);

      if (isLoading) {
        return (
            <div className="bg-[#060505]">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {skeletons}
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
          <h1 className='text-white text-left text-xl tracking-wide'>Our Products</h1>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg lg:aspect-none lg:h-80">
                    <img
                        src={product.image}
                        alt={product.image}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 px-2 py-1 rounded-tl-md text-sm font-bold">
                        $ {product.price}
                    </div>
                </div>
                <div className="mt-4 flex justify-between">
                    <h3 className="text-xl text-white pt-1 capitalize font-bold">
                        {product.name}
                    </h3>
                    <div>
                        <Button btnBg={isAdded.some(item => item._id === product._id)  ? 'bg-[#ff0000]' : 'bg-[#5fd4f6]'}  btnText={
                            isAdded.some(item => item._id === product._id)  ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                              )
                        } onClick={() => addToCart(product)} textColor={'dark'}></Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
