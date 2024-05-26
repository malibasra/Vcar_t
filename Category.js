import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Category() {
  const [image, setImage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/category')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setImage(response.data);
        } else {
          console.log('Error: Image data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching images: ', error);
      });
  }, []);

  const handleCategoryClick = (category) => {
    localStorage.setItem('selectedCategory', category);
    navigate(`/${category}`); // Redirect to category page
  };

  return (
    <div className='fst-italic text-center bg-primary-subtle'>
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 justify-content-center">
          {image.map((image, index) => (
            <div key={index} className="col-md-3 col-sm-6 col-12">
              <div className="card" style={{ width: '100%', margin: '10px' }}>
                <img src={'http://localhost:8081/category/' + image.CategoryPic} className="card-img-top" alt="..." style={{ height: '100px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => handleCategoryClick(image.CategoryName)} />
                <div className="card-body" style={{ padding: '5px' }}>
                  <h5 className="card-title" style={{ fontSize: '14px' }}>{image.CategoryName}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
