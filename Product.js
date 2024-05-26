import React,{useState} from 'react'
import Navbar from './Navbar'
import axios from 'axios';

export default function Product() {
    const [image,setimage]=useState();
    const [productname,setproductname]=useState('')
    const [price,setprice]=useState('')
    const handleupload=(event)=>{
        const formdata=new FormData();
        formdata.append('image',image);
        formdata.append('productname', productname);
        formdata.append('price', price);
        axios.post('http://localhost:8081/product',formdata)
        .then(res=>{
            if(res.data.Status==="Success"){
                console.log("Success")
            }
            else{
                console.log("Failed");
            }
        })
        .catch(err=>console.log(err));
    }
  return (
    <div className='bg-primary-subtle text-center '>
        <Navbar/>
      <h1>Insert the Product</h1>
      <div className='d-flex pb-5 justify-content-center align-items-center'>
      <div className='p-3  w-25 bg-primary pb-5'>
        <form onSubmit={handleupload}>
            <div className='mb-3'>
                <label htmlFor='productname'>Product Name</label>
                <input type='text' placeholder='Enter Product Name' className='form-control'
                onChange={e => setproductname(e.target.value)}/>
            </div>
            <div className='mb-3'>
                <label htmlFor='productprice'>Price</label>
                <input type='number' placeholder='Enter Product Price' className='form-control'
                onChange={e => setprice(e.target.value)}/>
            </div>
            <div className='mb-3 pb-5'>
                <label htmlFor='img'>Image</label>
                <input type='file' name='image' placeholder='Select Image' className='form-control' onChange={e => 
                    setimage(e.target.files[0])} />
            </div>
            <button type='submit' className='btn btn-success '>Insert</button>
        </form>
      </div>
      </div>
    </div>
  )
}
