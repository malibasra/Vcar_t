import React from 'react';

import Navbar from './Navbar';
import Slider from './Slider';
import Footer from './Footer';
import Category from './Category';
import Promotion from '../product/Promotion';

export default function Main() {
  return (
    <div className='fst-italic text-center bg-primary-subtle'>
      <Navbar />
      <img src="/vcartlogo.jpeg" className="rounded bg-primary-subtle img-fluid" alt="VCart Logo" style={{ maxWidth: '150px', marginTop: '10px' }} />
      <h1>Welcome to <strong>V CART!</strong></h1>
      <Slider />
      <Promotion/>
      <div className="container">
        <h2>Category</h2>
      </div>
      <Category/>
      <Footer/>
    </div>
  )
}