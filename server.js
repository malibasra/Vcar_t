const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sql = require('mssql');
const app = express();
const stripe = require("stripe")("sk_test_51PJy6jBCK7se0GTnwwyQyjUxsDdRE2eFrLG16MSnNNvR22RqY4F2xObL9NzO82CTjD2NNKdHkCEV9QimzvTuZhlG00ptqRJtBi");

//import files
const cart = require('./cart');
const handlebacket = require('./handlebacket');
const removebacket = require('./removecart');
const searchproduct = require('./searchproduct');
const removeproduct = require('./removeproduct');
const vieworderdetail = require('./vieworderdetail');
const removestaff = require('./removestaff');
const removecategory = require('./removecategory');
const removepromotion = require('./removepromotion');
const staffid = require('./staffid');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));


// Configure connection pool settings
const config = {
  user: 'Vcart',
  password: '12345',
  server: 'DESKTOP-P8H0KJB\\MSSQLSERVER01',
  database: 'Vcart',
  options: {
    encrypt: true, // If you're on Microsoft Azure, set this to true
    trustServerCertificate: true,
  },
};

// Initialize the connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// User login code
app.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM dbo.Tbl_User WHERE UserName = @username AND UserEmail = @email AND UserPassword = @password');

    if (result.recordset.length > 0) {
        return res.json("Login Successfully");
    } 
    else {
      return res.json("No Record");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging in' });
  }
});

// User registration code
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/users");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    },
  }),
}).single("image");

app.post('/register', upload, async (req, res) => {
  const image = req.file.filename;
  const { username, email, contact, address, age, password } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('contact', sql.NVarChar, contact)
      .input('address', sql.NVarChar, address)
      .input('age', sql.Int, age)
      .input('image', sql.NVarChar, image)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO dbo.Tbl_User (UserName, UserEmail, UserCell, UserAddress, UserAge, UserPic, UserPassword) VALUES (@username, @email, @contact, @address, @age, @image, @password)');

    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

// Fetch categories
app.get('/category', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT Id,CategoryPic, CategoryName FROM dbo.Tbl_Product_Category');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching images from database', err);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// View the product
app.get('/product', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT Id, ProductName, ProductPrice,ProductCost, ProductPic, ProductDescription,ProductSize, ProductCategoryFID FROM dbo.Tbl_Product');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching products from database', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Add product detail into cart
app.post('/cart/add', async (req, res) => {
  const { ProductID, UserName, Quantity, OrderDate, ProductPrice,Buy } = req.body;

  try {
    const response = await cart.addProductToCart(ProductID, UserName, Quantity, OrderDate, ProductPrice,Buy);
    if (response.message === 'Product added to cart successfully') {
      res.json({ message: 'Product added to cart successfully' });
    } else {
      res.status(500).json({ error: response.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

// Fetch product detail from cart
app.post('/cart/details', async (req, res) => {
  const {  UserName ,Buy } = req.body;

  try {
    const UserId = await cart.getUserID(UserName);

    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserId', sql.Int, UserId)
      .input('Buy',sql.Int,Buy)
      .query('SELECT * FROM dbo.Tbl_OrderDetail WHERE UserFID = @UserId AND Buy=@Buy');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching cart from database', err);
    res.status(500).json({ error: 'Error fetching cart data' });
  }
});

//handle backet 
app.post('/product/updateSize', async (req, res) => {
  const { ProductID, ProductSize } = req.body;

  try {
    const updateResponse = await handlebacket.updateProductSize(ProductID, ProductSize);
    res.json(updateResponse);
  } catch (error) {
    res.status(500).json(error);
  }
});

//user click on remove button then remove data from orderdetail
app.delete('/cart/remove', async (req, res) => {
  const { ProductID, UserName, Buy } = req.body;

  try {
    // Call the function to delete item from order detail
    const removeresponse = await removebacket.deleteOrderDetailData(ProductID, UserName, Buy);
    res.json(removeresponse);
  } catch (error) {
    // Handle errors
    console.error('Error removing item from cart:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//search the product through search bar
app.get('/productname/search', async (req, res) => {
  const { productName } = req.query;
  try {
    const categoryId = await searchproduct.findProductCategory(productName);
    if (categoryId) {
      const categoryName = await searchproduct.findCategoryName(categoryId);
      if (categoryName) {
        res.json({ categoryName });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Admin login code
app.post('/Admin/Login', async (req, res) => {
  try {
    const { name,email, password  } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM dbo.Tbl_Admin WHERE AdminName = @name AND AdminEmail = @email AND AdminPassword = @password');

    if (result.recordset.length > 0) {
        return res.json("Admin Successfully");
    } 
    else {
      return res.json("No Record");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging in' });
  }
});

// Staff login code
app.post('/Staff/Login', async (req, res) => {
  try {
    const { name,email, password  } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM dbo.Tbl_Staff WHERE StaffName = @name AND StaffEmail = @email AND StaffPassword = @password');

    if (result.recordset.length > 0) {
        return res.json("Staff Successfully");
    } 
    else {
      return res.json("No Record");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging in' });
  }
});

//admin can delete product data
app.delete('/product/remove', async (req, res) => {
  const { ProductID} = req.body;

  //console.log(ProductID);
  try {
    // Call the function to delete item from product
    const removeresponse = await removeproduct.deleteProduct(ProductID);
    res.json(removeresponse);
  } catch (error) {
    // Handle errors
    console.error('Error removing item from product:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//admin insert the product

const uploadproduct = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/product");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    },
  }),
}).single("productimage");

app.post('/product/insert', (req, res) => {
  uploadproduct(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }

    const productimage = req.file ? req.file.filename : null;
    const { productname, productcost, productprice, productsize, productdescription, productcategory } = req.body;

    if (!productname || !productcost || !productprice || !productsize || !productdescription || !productcategory || !productimage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('productname', sql.NVarChar, productname)
        .input('productcost', sql.Money, productcost)
        .input('productprice', sql.Money, productprice)
        .input('productsize', sql.Int, productsize)
        .input('productdescription', sql.NVarChar, productdescription)
        .input('productimage', sql.NVarChar, productimage)
        .input('productcategory', sql.Int, productcategory)
        .query('INSERT INTO dbo.Tbl_Product (ProductName, ProductCost, ProductPrice, ProductDescription, ProductPic, ProductCategoryFID, ProductSize) VALUES (@productname, @productcost, @productprice, @productdescription, @productimage, @productcategory, @productsize)');

      res.status(201).json({ message: 'Product inserted successfully' });
    } catch (err) {
      console.error('Error inserting product:', err.message);
      res.status(500).json({ message: 'Error inserting product' });
    }
  });
});

//admin update the product

app.post('/product/update', (req, res) => {
  uploadproduct(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }

    const productimage = req.file ? req.file.filename : null;
    const { productId, productname, productcost, productprice, productsize, productdescription, productcategory } = req.body;

    if (!productId || !productname || !productcost || !productprice || !productsize || !productdescription || !productcategory) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('productId', sql.Int, productId)
        .input('productname', sql.NVarChar, productname)
        .input('productcost', sql.Money, productcost)
        .input('productprice', sql.Money, productprice)
        .input('productsize', sql.Int, productsize)
        .input('productdescription', sql.NVarChar, productdescription)
        .input('productimage', sql.NVarChar, productimage)
        .input('productcategory', sql.Int, productcategory)
        .query('UPDATE dbo.Tbl_Product SET ProductName = @productname, ProductCost = @productcost, ProductPrice = @productprice, ProductDescription = @productdescription, ProductPic = @productimage, ProductCategoryFID = @productcategory, ProductSize = @productsize WHERE Id = @productId');

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product:', err.message);
      res.status(500).json({ message: 'Error updating product' });
    }
  });
});

//admin view user
// View the product
app.get('/user', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Tbl_User');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching products from database', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
});
//view the order detail about user
app.post('/vieworderdetail', async (req, res) => {
  const {userId} = req.body;
  //console.log(userId);

  try {
    // Call the function to delete item from product
    const viewresponse = await vieworderdetail.getOrderDetail(userId);
    res.json(viewresponse);
  } catch (error) {
    // Handle errors
    console.error('Error viewing item from order detail:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// View the promotion
app.get('/promotion', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT PromotionId, ProductFID, PromotionPrice,PeomotionStart, PromotionEnd FROM dbo.Tbl_Promotion');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching promotion from database', err);
    res.status(500).json({ error: 'Error fetching promotions' });
  }
});

// View the staff
app.get('/staff', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT StaffId, StaffName, StaffEmail, StaffCell, StaffPassword ,StaffAddress, StaffPic FROM dbo.Tbl_Staff');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching staff data from database', err);
    res.status(500).json({ error: 'Error fetching staff' });
  }
});

//admin can delete staff data
app.delete('/staff/remove', async (req, res) => {
  const { staffId} = req.body;

  //console.log(ProductID);
  try {
    // Call the function to delete item from product
    const removeresponse = await removestaff.deleteStaff(staffId);
    res.json(removeresponse);
  } catch (error) {
    // Handle errors
    console.error('Error removing item from staff:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//admin insert the staff

const uploadstaff = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/staff");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    },
  }),
}).single("staffPic");
app.post('/staff/insert', (req, res) => {
  uploadstaff(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }

    const staffPic = req.file ? req.file.filename : null;
    const { staffName, staffEmail, staffCell, staffPassword, staffAddress} = req.body;

    if (!staffName || !staffEmail || !staffCell || !staffPassword || !staffAddress || !staffPic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('staffName', sql.NVarChar, staffName)
        .input('staffEmail', sql.NVarChar, staffEmail)
        .input('staffCell', sql.BigInt, staffCell)
        .input('staffPassword', sql.VarChar, staffPassword)
        .input('staffAddress', sql.NVarChar, staffAddress)
        .input('staffPic', sql.Text, staffPic)
        .query('INSERT INTO dbo.Tbl_Staff (StaffName, StaffEmail, StaffCell, StaffPassword, StaffAddress, StaffPic) VALUES (@staffName, @staffEmail, @staffCell, @staffPassword, @staffAddress, @staffPic)');

      res.status(201).json({ message: 'Staff inserted successfully' });
    } catch (err) {
      console.error('Error inserting staff data:', err.message);
      res.status(500).json({ message: 'Error inserting staff data' });
    }
  });
});

//admin update the staff
app.post('/staff/update', (req, res) => {
  uploadstaff(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }

    const staffPic = req.file ? req.file.filename : null;
    const { staffId,staffName, staffEmail, staffCell, staffPassword, staffAddress} = req.body;

    if (!staffId || !staffName || !staffEmail || !staffCell || !staffPassword || !staffAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('staffId', sql.Int, staffId)
        .input('staffName', sql.NVarChar, staffName)
        .input('staffEmail', sql.NVarChar, staffEmail)
        .input('staffCell', sql.BigInt, staffCell)
        .input('staffPassword', sql.VarChar, staffPassword)
        .input('staffAddress', sql.NVarChar, staffAddress)
        .input('staffPic', sql.Text, staffPic)
        .query('UPDATE dbo.Tbl_Staff SET StaffName = @staffName, StaffEmail = @staffEmail, StaffCell = @staffCell, StaffPassword = @staffPassword, StaffAddress = @staffAddress, StaffPic = @staffPic WHERE StaffId = @staffId');

      res.status(200).json({ message: 'Staff updated successfully' });
    } catch (err) {
      console.error('Error updating staff:', err.message);
      res.status(500).json({ message: 'Error updating staff' });
    }
  });
});

//admin can delete category data
app.delete('/category/remove', async (req, res) => {
  const { CategoryID} = req.body;
  try {
    // Call the function to delete item from product
    const removeresponse = await removecategory.deleteCategory(CategoryID);
    res.json(removeresponse);
  } catch (error) {
    // Handle errors
    console.error('Error removing item from category:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//admin insert the category
const uploadcategory = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/category");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + ".jpg");
    },
  }),
}).single("categoryPic");
app.post('/category/insert', (req, res) => {
  uploadcategory(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }

    const categoryPic = req.file ? req.file.filename : null;
    const { categoryName} = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('categoryName', sql.NVarChar, categoryName)
        .input('categoryPic', sql.Text, categoryPic)
        .query('INSERT INTO dbo.Tbl_Product_Category (CategoryName, CategoryPic) VALUES (@categoryName,@categoryPic)');

      res.status(201).json({ message: 'Category inserted successfully' });
    } catch (err) {
      console.error('Error inserting category data:', err.message);
      res.status(500).json({ message: 'Error inserting category data' });
    }
  });
});
//admin update the category
app.post('/category/update', (req, res) => {
  uploadcategory(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error' });
    }
    const categoryPic = req.file ? req.file.filename : null;
    const { categoryId,categoryName} = req.body;

    if (!categoryId || !categoryName || !categoryPic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .input('categoryName', sql.NVarChar, categoryName)
        .input('categoryPic', sql.Text, categoryPic)
        .query('UPDATE dbo.Tbl_Product_Category SET CategoryName = @categoryName, CategoryPic = @categoryPic WHERE Id = @categoryId');

      res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
      console.error('Error updating category:', err.message);
      res.status(500).json({ message: 'Error updating category' });
    }
  });
});
//admin can delete promotion data
app.delete('/promotion/remove', async (req, res) => {
  const { PromotionID} = req.body;
  try {
    // Call the function to delete item from product
    const removeresponse = await removepromotion.deletePromotion(PromotionID);
    res.json(removeresponse);
  } catch (error) {
    // Handle errors
    console.error('Error removing item from promotion:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//admin insert promotion
app.post('/promotion/insert', async (req, res) => {
  const { productpromotion, promotionprice, promotionend } = req.body;
  if (!productpromotion || !promotionprice || !promotionend) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const promotionStart = new Date(); // Set promotionStart to the current date
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('productpromotion', sql.Int, productpromotion)
      .input('promotionPrice', sql.Money, promotionprice)
      .input('promotionStart', sql.Date, promotionStart)
      .input('promotionEnd', sql.Int, promotionend)
      .query('INSERT INTO dbo.Tbl_Promotion (ProductFID, PromotionPrice, PeomotionStart, PromotionEnd) VALUES (@productpromotion, @promotionprice, @promotionstart, @promotionend)');

    res.status(201).json({ message: 'Promotion inserted successfully' });
  } catch (err) {
    console.error('Error inserting promotion data:', err.message);
    res.status(500).json({ message: 'Error inserting promotion data' });
  }
});
//admin update promotions
app.post('/promotion/update', async (req, res) => {
  const { promotionprice,productpromotion,promotionend,id } = req.body;
  if (!productpromotion || !promotionprice || !promotionend) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const promotionStart = new Date(); // Set promotionStart to the current date
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Id', sql.Int,id)
      .input('productpromotion', sql.Int, productpromotion)
      .input('promotionPrice', sql.Money, promotionprice)
      .input('promotionStart', sql.Date, promotionStart)
      .input('promotionEnd', sql.Int, promotionend)
      .query('UPDATE dbo.Tbl_Promotion SET ProductFID = @productpromotion, PromotionPrice = @promotionprice, PeomotionStart = @promotionStart,PromotionEnd = @promotionend WHERE PromotionId = @id');

    res.status(201).json({ message: 'Promotion inserted successfully' });
  } catch (err) {
    console.error('Error inserting promotion data:', err.message);
    res.status(500).json({ message: 'Error inserting promotion data' });
  }
});

//for payment gateway stripe
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.productName,
      },
      unit_amount: product.productPrice * 100,
    },
    quantity: product.productQuantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Corrected typo here
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});
//update the buy column in order detail table when click on buy now
app.post('/update/buy', async (req, res) => {
  const { UserName, Buy } = req.body;
  try {
    const UserId = await cart.getUserID(UserName);
    //console.log(UserId);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserId', sql.Int, UserId)
      .input('Buy', sql.Int, Buy)
      .query('UPDATE dbo.Tbl_OrderDetail SET Buy = @Buy WHERE UserFID = @UserId');

    res.json({ success: true, message: 'Buy status updated successfully' });
  } catch (err) {
    console.error('Error updating buy status in the database', err);
    res.status(500).json({ error: 'Error updating buy status' });
  }
});
//insert into the order status table
app.post('/insert/orderstatus', async (req, res) => {
  const orderStatus = req.body.orderStatus;

  if (!Array.isArray(orderStatus) || orderStatus.length === 0) {
    return res.status(400).json({ error: 'Invalid order status data' });
  }

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      for (const status of orderStatus) {
        const { username, productName, orderId, staffId, status: orderStatusValue, subtotal, productQuantity, usercell, useraddress} = status;
      
        const request = new sql.Request(transaction); // Create a new request object for each iteration
      
        await request
          .input('UserName', sql.NVarChar, username)
          .input('ProductName', sql.NVarChar, productName)
          .input('OrderId', sql.Int, orderId)
          .input('StaffFID', sql.Int, staffId)
          .input('Status', sql.NVarChar, orderStatusValue)//Renamed 'status' to 'orderStatusValue' to avoid naming conflict
          .input('Total', sql.Money, subtotal)
          .input('UserAddress',sql.NVarChar,useraddress)
          .input('UserCell',sql.BigInt,usercell)
          .input('ProductQuantity', sql.Int, productQuantity)
          .query(`
            INSERT INTO dbo.Tbl_OrderStatus (OrderFID, StaffFID, ProductName, UserName, ProductQuantity, Total, Status,UserAddress,UserCell)
            VALUES (@OrderId, @StaffFID, @ProductName, @UserName, @ProductQuantity, @Total, @Status,@UserAddress,@UserCell)
          `);
      }
      await transaction.commit();
      res.status(200).json({ success: true, message: 'Order status inserted successfully' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error inserting order status', error);
      res.status(500).json({ error: 'Error inserting order status' });
    }
  } catch (error) {
    console.error('Database connection error', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

//fetch the order status data
app.post('/order/details', async (req, res) => {
  const { StaffName  } = req.body;
  try {
    const StaffId = await staffid.getStaffID(StaffName);

    const pool = await poolPromise;
    const result = await pool.request()
      .input('StaffId', sql.Int, StaffId)
      .query('SELECT * FROM dbo.Tbl_OrderStatus WHERE StaffFID = @StaffId');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching cart from database', err);
    res.status(500).json({ error: 'Error fetching cart data' });
  }
});
//update the order status
app.post('/deliver/order', async (req, res) => {
  const { OrderId, ProductName, UserName, StaffName } = req.body;

  const Status = "Delivered";

  try {
    const StaffId = await staffid.getStaffID(StaffName); // Ensure getStaffID is properly imported and used
    const pool = await poolPromise;
    const result = await pool.request()
      .input('OrderFID', sql.Int, OrderId)
      .input('ProductName', sql.NVarChar, ProductName)
      .input('UserName', sql.NVarChar, UserName)
      .input('StaffFID', sql.Int, StaffId)
      .input('Status', sql.NVarChar, Status)
      .query(`
        UPDATE dbo.Tbl_OrderStatus
        SET Status = @Status
        WHERE OrderFID = @OrderFID
        AND ProductName = @ProductName
        AND UserName = @UserName
        AND StaffFID = @StaffFID
      `);

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status in the database', err);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

//fetch the useraddress from user table
app.get('/useraddress', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserName', sql.VarChar, username)
      .query('SELECT UserAddress, UserCell FROM dbo.Tbl_User WHERE UserName = @UserName');

    if (result.recordset.length > 0) {
      const { UserAddress, UserCell } = result.recordset[0];
      res.json({ address: UserAddress, cell: UserCell });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching address from database', err);
    res.status(500).json({ error: 'Error fetching address' });
  }
});

//fetch the order status data
app.post('/orderdata', async (req, res) => {
  try {
    
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM dbo.Tbl_OrderStatus');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching order data from database', err);
    res.status(500).json({ error: 'Error fetching order data' });
  }
});
// fetch the staff name and StaffId
app.post('/staffname', async (req, res) => {
  try {
    
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT StaffId,StaffName FROM dbo.Tbl_Staff');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching staff data from database', err);
    res.status(500).json({ error: 'Error fetching staff data' });
  }
});

// fetch the order date and sale
app.get('/chartdata', async (req, res) => {
  try {
    
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT OrderDate,TotalAmount,ProductQuantity FROM dbo.Tbl_OrderDetail');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching order data from database', err);
    res.status(500).json({ error: 'Error fetching order data' });
  }
});


/*app.post('/insert/orderstatus',async(req,res)=>{
  const orderStatus = req.body.orderStatus;
  console.log(orderStatus);
});
*/



  /*const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'image'
  });
  con.connect((err)=>{
    if(err){
      console.log('Error connecting to Mysql ',err);
      return;
    }
    console.log('Connectect to Mysql database');
  });
  app.get('/main',(req,res)=>{
    const sql="SELECT * FROM picture";
    con.query(sql,(err,results)=>{
      if(err){
        console.log('Error fecting image from database ',err);
        return res.status(500).json({error:'Error fetching images '});
        //return res.json("error");
      }
      return res.json(results);
    });
  });

  //for upload images
  
  const storage=multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'public/images'; // Destination directory
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  })
  const upload=multer({
    storage:storage
  })
  app.post('/product',upload.single('image'),(req,res)=>{
    const image=req.file.filename;
    const {productname,price} = req.body;
    //console.log(img);
    //console.log(image);
    //console.log(productname);
    //console.log(price);
    const sql='INSERT INTO picture (Name,Price,Img) VALUES (?, ?, ?)';
    const values=[productname,price,image];
    con.query(sql, values, (err, results) => {
      if (err) return res.json({Message :"Error"});
      return res.json({Status:"Success"});
    });

  })

  //For update the product
  app.post('/updateproduct',upload.single('image'),(req,res)=>{
    const image=req.file.filename;
    const {productname,price,updatename}=req.body;
    const values=[productname,price,image,updatename]
    const sql="UPDATE picture SET Name = ?, Price=?, Img=? WHERE Name=?";
    con.query(sql,values,(err,results)=>{
      if(err) return res.json("Error");
      return res.json("Success");
    });
    
  })
*/


//const express = require('express');
//const app = express();

//user login code


// Start the server
app.listen(8081, () => {
    console.log("Listening...."); 
})