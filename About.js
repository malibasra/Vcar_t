import React from 'react'
import Navbar from './Navbar'

export default function About() {
  return (
    <>
    <Navbar/>
    <div className="fst-italic bg-primary-subtle">
      <h1 className='text-center'>Welcome to <strong>V CART</strong></h1>
       <h4 className='text-start'>Your Premier Online Retailer:</h4>
       <p className='text-xxl-end fs-4'>At <strong>V CART</strong>, we're more than just an online store; we're your destination for quality products and exceptional shopping experiences. Established with a passion for providing top-notch service and a diverse range of goods, Goracy Shop has quickly become a trusted name in online retail.</p>
       <h4 className='text-start'>Our Commitment:</h4>
       <p className='text-xxl-end fs-4'>At <strong>V CART</strong>,  our commitment is to deliver a seamless and enjoyable shopping journey for our valued customers. We curate a selection of premium products that cater to your lifestyle, ensuring that every purchase brings joy and satisfaction.</p>
       <h4 className='text-start'>Quality You Can Trust:</h4>
       <p className='text-xxl-end fs-4'>We take pride in offering only the finest products that meet our stringent quality standards.Each item in our inventory is chosen with care, promising durability, and reliability</p>
    </div>
    </>
  )
}
