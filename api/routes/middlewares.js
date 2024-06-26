const express = require("express");
const app = express();
const cors = require("cors");

// CORS configuration
app.use(cors());

// Middleware object
const middlewareObj = {};

// Pagination middleware
middlewareObj.paginatedData = function (model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit,
            };
        }

        if (endIndex <= await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit,
            };
        }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
};

module.exports = middlewareObj;
