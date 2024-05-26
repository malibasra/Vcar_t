import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Comm/Login';
import Register from './Comm/Register';
import Main from './Comm/Main';
import About from './Comm/About';
import Product from './Comm/Product';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Fruit from './product/Fruit';
import Logout from './Comm/Logout';
import Vegetable from './product/Vegetable';
import Category from './Comm/Category';
import Drink from './product/Drink';
import Meat from './product/Meat';
import Bakery from './product/Bakery';
import Cart from './Comm/Cart';
import Adminnavbar from './Admin/Adminnavbar';
import AdminDashboard from './Admin/AdminDashboard';
import Productmanagement from './Admin/Productmanagement';
import Updateproductadmin from './Admin/Updateproductadmin';
import UserManagement from './Admin/UserManagement';
import Promotion from './product/Promotion';
import Staffmanagement from './Admin/Staffmanagement';
import UpdateStaff from './Admin/Updatestaff';
import Adminlogin from './Admin/Adminlogin';
import Categorymanagement from './Admin/Categorymanagement';
import Updatecategory from './Admin/Updatecategory';
import Promotionmanagement from './Admin/Promotionmanagement';
import Updatepromotion from './Admin/Updatepromotion';
import Stafflogin from './Staff/Stafflogin';
import Staffview from './Staff/Staffview';
import Success from './Comm/Success';
import Cancel from './Comm/Cancel';
import Ordermanagement from './Admin/Ordermanagement';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "Login",
    element: <Login/>,
  },
  {
    path: "Register",
    element: <Register/>,
  },
  {
    path: "Main",
    element: <Main/>,
  },
  {
    path: "About",
    element: <About/>,
  },
  {
    path:"Adminlogin",
    element:<Adminlogin/>
  },
  {
    path:"Product",
    element:<Product/>
  },
  {
    path:"Logout",
    element:<Logout/>
  },
  {
    path:"Cart",
    element:<Cart/>
  },
  {
    path:"Category",
    element:<Category/>
  },
  {
    path:"Fruit",
    element:<Fruit/>
  },
  {
    path:"Vegetable",
    element:<Vegetable/>
  },
  {
    path:"Drink",
    element:<Drink/>
  },
  {
    path:"Meat",
    element:<Meat/>
  },
  {
    path:"Bakery",
    element:<Bakery/>
  },
  {
    path:"Adminnavbar",
    element:<Adminnavbar/>
  },
  {
    path:"AdminDashboard",
    element:<AdminDashboard/>
  },
  {
    path:"Productmanagement",
    element:<Productmanagement/>
  },
  {
    path:"Updateproductadmin",
    element:<Updateproductadmin/>
  },
  {
    path:"UserManagement",
    element:<UserManagement/>
  },
  {
    path:"Staffmanagement",
    element:<Staffmanagement/>
  },
  {
    path:"UpdateStaff",
    element:<UpdateStaff/>
  },
  {
    path:"Categorymanagement",
    element:<Categorymanagement/>
  },
  {
    path:"Updatecategory",
    element:<Updatecategory/>
  },
  {
    path:"Promotion",
    element:<Promotion/>
  },
  {
    path:"Promotionmanagement",
    element:<Promotionmanagement/>
  },
  {
    path:"Updatepromotion",
    element:<Updatepromotion/>
  },
  {
    path:"Ordermanagement",
    element:<Ordermanagement/>
  },
  {
    path:"Stafflogin",
    element:<Stafflogin/>
  },
  {
    path:"Staffview",
    element:<Staffview/>
  },
  {
    path:"Success",
    element:<Success/>
  },
  {
    path:"Cancel",
    element:<Cancel/>
  },

  
  
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
