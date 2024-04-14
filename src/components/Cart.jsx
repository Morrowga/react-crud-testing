import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Cart({isCartOpen, closeCart, selectedproducts, addToCart, postLoading, checkoutSuccess, decreaseQuantity, increaseQuantity, calculateTotalQuantity, calculateTotalPrice, checkOut}) {
  const totalQty = calculateTotalQuantity()
  const totalPrice = calculateTotalPrice()
  return (  
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Your Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => closeCart()}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {selectedproducts.map((product) => (
                              <li key={product._id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.image}
                                    alt={product.image}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3 className="text-xl">
                                        <a href="/#">{product.name}</a>
                                      </h3>
                                      <p className="ml-4">$ {product.price}</p>
                                    </div>
                                  </div>
                                  <p className="my-3 text-sm">Qty</p>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center">
                                    <button
                                        className="px-3 py-1 rounded-l border border-gray-300 bg-gray-100 hover:bg-gray-200"
                                        onClick={() => decreaseQuantity(product._id)}
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 border-t border-b border-gray-300">
                                        {product.qty}
                                    </span>
                                    <button
                                        className="px-3 py-1 rounded-r border border-gray-300 bg-gray-100 hover:bg-gray-200"
                                        onClick={() => increaseQuantity(product._id)}
                                    >
                                        +
                                    </button>
                                    </div>
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => addToCart(product)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total Qty</p>
                        <p>{totalQty}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$ {totalPrice}</p>
                      </div>
                      <div className="mt-6">
                      <button
                            onClick={() => checkOut()}
                            disabled={postLoading}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-[#5fd4f6] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#06b3d8]"
                            >
                            {postLoading ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5a1.5 1.5 0 113 0V4a8 8 0 01-8 8z"></path>
                                </svg>
                            ) : (
                                "Checkout"
                            )}
                            </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-[#5fd4f6] hover:text-[#5fd4f6]"
                            onClick={() => closeCart()}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
