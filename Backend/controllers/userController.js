const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler.js");
const pool = require("../db/db.js");
const bcrypt = require("bcryptjs"); // For hashing the password
const { ApiResponse } = require("../utils/ApiResponse"); // Adjust the path as necessary

const studentSignUp = asyncHandler(async (req, res) => {
  const {
    full_name,
    email,
    contact_number,
    degree,
    cgpa,
    passing_year,
    experience_in_years,
    college,
    password,
    confirm_password // Added confirm password for validation
  } = req.body;

  // Full Name validation
  const fullName = full_name?.trim();
  if (!fullName) {
    throw new ApiError(404, "Full name is required");
  }

  // Email validation (basic regex for checking format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ApiError(404, "Valid email is required");
  }

  // Check if the email already exists in the users table
  const [[existingUser]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  // Contact Number validation (exactly 10 digits)
  const contactNumberRegex = /^[0-9]{10}$/;
  if (!contact_number || !contactNumberRegex.test(contact_number)) {
    throw new ApiError(404, "Contact number must be exactly 10 digits");
  }

  // Degree validation
  const studentDegree = degree?.trim();
  if (!studentDegree) {
    throw new ApiError(404, "Degree is required");
  }

  // CGPA validation (range from 0 to 10 with 2 decimal precision)
  if (cgpa == null || isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    throw new ApiError(404, "CGPA must be between 0 and 10");
  }

  // Passing Year validation (must be a valid year between 1900 and current year)
  const currentYear = new Date().getFullYear();
  if (!passing_year || isNaN(passing_year) || passing_year < 1900 || passing_year > currentYear + 4) {
    throw new ApiError(404, `Passing year must be between 1900 and ${currentYear}`);
  }

  // Experience in Years validation (must be a positive number or zero)
  if (experience_in_years == null || isNaN(experience_in_years) || experience_in_years < 0) {
    throw new ApiError(404, "Experience in years must be a positive number or zero");
  }

  // College validation
  const studentCollege = college?.trim();
  if (!studentCollege) {
    throw new ApiError(404, "College name is required");
  }

  // Password validation (minimum 8 characters)
  if (!password || password.length < 8) {
    throw new ApiError(404, "Password must be at least 8 characters long");
  }

  // Confirm Password validation (must match password)
  if (password !== confirm_password) {
    throw new ApiError(404, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // If validation passes, continue with user creation
  let connection;
  try {
    // Get a connection and start a transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Hash the password before storing it
    

    // Insert user into Users table
    const [result] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'Candidate'] // Assuming 'Candidate' as role
    );

    const userId = result.insertId;

    // Insert student info into Student_Info table
    await connection.query(
      'INSERT INTO Student_Info (user_id, full_name, contact_number, college_name, degree, cgpa, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, fullName, contact_number, studentCollege, studentDegree, cgpa, passing_year]
    );

    // Commit the transaction
    await connection.commit();

    // Send success response using ApiResponse
    const response = new ApiResponse(201, { userId, full_name: fullName });
    res.status(response.statuscode).json(response);

  } catch (error) {
    // Rollback the transaction in case of an error
    if (connection) await connection.rollback();
    console.error("Database error:", error);
    throw new ApiError(500, "An error occurred while creating the user");
  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
});

const recruiterSignup = asyncHandler(async(req,res) =>{
  const {fullName,email,password,confirm_password,contact_number,company_name,position} = req.body;
    // Full Name validation
    const recruiterFullName = fullName?.trim();
    if (!recruiterFullName) {
      throw new ApiError(404, "Full name is required");
    }

    // Email validation (basic regex for checking format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ApiError(404, "Valid email is required");
    }

    // Check if the email already exists in the users table
    const [[existingUser]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    // Contact Number validation (exactly 10 digits)
    const contactNumberRegex = /^[0-9]{10}$/;
    if (!contact_number || !contactNumberRegex.test(contact_number)) {
      throw new ApiError(404, "Contact number must be exactly 10 digits");
    }

    // Company Name validation
    const recruiterCompanyName = company_name?.trim();
    if (!recruiterCompanyName) {
      throw new ApiError(404, "Company name is required");
    }

    // Position validation
    const recruiterPosition = position?.trim();
    if (!recruiterPosition) {
      throw new ApiError(404, "Position is required");
    }

    // Password validation (minimum 8 characters)
    if (!password || password.length < 8) {
      throw new ApiError(404, "Password must be at least 8 characters long");
    }

    // Confirm Password validation (must match password)
    if (password !== confirm_password) {
      throw new ApiError(404, "Passwords do not match");
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert into 'users' table
    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'HR']
    );

    // Ensure 'insertId' is retrieved correctly
    const userId = userResult.insertId;

    if (!userId) {
      throw new Error('Failed to insert user into the users table.');
    }

    // Insert into 'Hr_Info' table
    await connection.query(
      'INSERT INTO Hr_Info (user_id, full_name, contact_number, company_name, position) VALUES (?, ?, ?, ?, ?)', 
      [userId, fullName, contact_number, company_name, position]
    );

    await connection.commit();

    const response = { userId, full_name: fullName };
    res.status(201).json({ success: true, data: response, message: 'Recruiter created successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the Recruiter' });

  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
});


/*{
  "email": "siddharth.gupta@example.com",
  "password": "Password789"
}

{
  "email": "arjun.kumar@company.com",
  "password": "StrongPass123"
}
  */
const userLogin = asyncHandler(async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(404, "Email and password are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ApiError(404, "Valid email is required");
  }

  console.log("Received email:", email, "Received password:", password);

  try {
    // Query the database for the user
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    console.log("Database query result:", user);  // Debugging line to log query result

    // Check if the user exists and if user[0] is not undefined
    if (!user || user.length === 0) {
      throw new ApiError(404, "User not found");
    }

    // Debug to check if the password exists
    if (!user[0].password) {
      console.error("Password not found for the user");
      throw new ApiError(404, "User not found !!!");
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user[0].password);
    console.log("Password match:", isMatch);  // Debugging line to log password match result
    console.log("Bcrypted password:", user[0].password);  // Debugging line to log the bcrypted password
    // Handle incorrect password
    if (!isMatch) {
      throw new ApiError(404, "Password is incorrect !!!");
    }

    // If password matches, check the user's role and respond accordingly
    if (isMatch) {
      if (user[0].role === 'Candidate') {
        console.log("Candidate login successful");
        res.status(200).json({ success: true, message: 'Candidate logged in successfully' });
      } else if (user[0].role === 'HR') {
        console.log("HR login successful");
        res.status(200).json({ success: true, message: 'HR logged in successfully' });
      }
    }
  } catch (error) {
    console.error("Login error:", error);  // Debugging line to log the error
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = { recruiterSignup, studentSignUp ,userLogin};