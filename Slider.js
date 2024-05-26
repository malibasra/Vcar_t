import React from 'react';

export default function Slider() {
  return (
    <div className="container-fluid p-0">
      <style>
        {`
          .carousel-item img {
            width: 100%;
            height: 100vh; /* set height to 100vh to make images equal size */
            object-fit: cover; /* add object-fit to scale images */
          }

          .carousel-inner {
            width: 100%; /* add width 100% to take full space */
          }

          .carousel-control-prev, .carousel-control-next {
            background-color: #ccc; /* add background color to prev/next buttons */
            width: 5%; /* adjust width as needed */
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            .carousel-item img {
              height: 50vh; /* reduce height on mobile devices */
            }
          }

          @media (max-width: 480px) {
            .carousel-control-prev, .carousel-control-next {
              width: 10%; /* increase width of prev/next buttons on smaller mobile devices */
            }
          }
        `}
      </style>
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/sale1.jpg" className="d-block w-100" alt="Sale 1"/>
          </div>
          <div className="carousel-item">
            <img src="/sale3.jpg" className="d-block w-100" alt="Sale 2"/>
          </div>
          <div className="carousel-item">
            <img src="/sale4.jpg" className="d-block w-100" alt="Sale 3"/>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
