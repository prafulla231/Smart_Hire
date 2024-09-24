const db = require("../db/db"); // Ensure this points to your db.js file

const getAllcandidates = async (req, res) => {
    try {
        // Use the promise-based query method correctly
        const [data] = await db.query('SELECT * FROM student');

        // Check if any records were found
        if (!data || data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }

        // Send the fetched data as a response
        res.status(200).send({
            success: true,
            data: data,
            message: 'Data fetched successfully'
        });
        
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({
            success: false,
            message: 'Error fetching students data!!! Error in getting all candidates',
            error: error.message
        });
    }
};

module.exports = {
    getAllcandidates
};
