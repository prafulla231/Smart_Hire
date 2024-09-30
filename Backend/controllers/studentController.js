const { asyncHandler } = require("../utils/asyncHandler.js");
const db = require("../db/db"); // Ensure this is the correct path

const getAllcandidates = asyncHandler(async (req, res) => {
    try {
        // Use the promise-based query method correctly
        const [data] = await db.query(
            'select * from users inner join student_info on users.user_id = student_info.user_id'
            // 'SELECT * FROM users AS u INNER JOIN Student_Info AS s ON u.user_id = s.user_id'
        );

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
});

module.exports = {
    getAllcandidates
};
