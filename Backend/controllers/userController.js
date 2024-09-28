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
  if (!passing_year || isNaN(passing_year) || passing_year < 1900 || passing_year > currentYear+4) {
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

  // If validation passes, continue with user creation
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Users table
    const [result] = await pool.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'Candidate'] // Assuming 'Candidate' as role
    );

    const userId = result.insertId;

    // Insert student info into Student_Info table
    await pool.query(
      'INSERT INTO Student_Info (user_id, full_name, contact_number, college_name, degree, cgpa, graduation_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, fullName, contact_number, studentCollege, studentDegree, cgpa, passing_year]
    );

    // Send success response using ApiResponse
    const response = new ApiResponse(201, { userId, full_name: fullName });
    res.status(response.statuscode).json(response);

  } catch (error) {
    // Handle any database errors that occur during insertion
    console.error("Database error:", error);
    throw new ApiError(500, "An error occurred while creating the user");
  }
});

module.exports = { studentSignUp };
