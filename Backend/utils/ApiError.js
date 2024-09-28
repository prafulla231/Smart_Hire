// This class extends the built-in Error class to create a custom error type named ApiError
class ApiError extends Error {
    // The constructor initializes the custom error object
    constructor(
        statusCode,                 // Status code for the error (e.g., 404 for Not Found)
        message = "Something went Wrong !!!",  // Default error message if none is provided
        errors = [],                // Additional errors or details about the error
        stack = ""                  // Stack trace information (empty by default)
    ) {
        // Call the parent class (Error) constructor with the provided message
        super(message); // This sets the message property on the Error object

        // Set the statusCode property with the provided status code
        this.statusCode = statusCode;
        
        // Initialize data property to null (could be used for additional data related to the error)
        this.data = null;
        
        // Set the message property with the provided message
        this.message = message;
        
        // Set success to false, indicating that an error has occurred
        this.success = false;
        
        // Set the errors property with the provided errors array
        this.errors = errors;

        // If a stack trace is provided, set the stack property
        if (stack) {
            this.stack = stack;
        } else {
            // If no stack trace is provided, capture the stack trace for this error
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class so it can be imported and used in other files
module.exports = { ApiError };
