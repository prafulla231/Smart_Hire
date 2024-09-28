// Define an asyncHandler function that takes a request handler function as an argument
//search node js apierror
const asyncHandler = (requestHandler) => {
    // Return a new function that handles the request, response, and next middleware function
    return (req, res, next) => {
        // Use Promise.resolve to handle the promise returned by the request handler
        // If the promise is rejected, catch the error and pass it to the next middleware
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

// Export the asyncHandler function so it can be imported and used in other files
module.exports = { asyncHandler };


/*
Using try-catch block..higher order functions are used 
const asyncHandler = () => {}  // Initial empty function
const asyncHandler = (func) => () => {}  // Higher-order function: takes a function and returns a new function
const asyncHandler = async(func) => () => {}  // Higher-order async function: takes a function and returns an async function
*/

// This is a wrapper function which we will use everywhere 
// const asyncHandler = (func) => async(req, res, next) => {
//     try {
//         await func(req, res, next);  // Execute the provided function and wait for it to complete
//     } catch (error) {
//         // If an error occurs, send a response with the error code (or 500 if not provided) and the error message
//         res.status(error.code || 500).json({
//             success: false,  // Indicate failure
//             message: error.message  // Include the error message
//         });
//     }
// }
