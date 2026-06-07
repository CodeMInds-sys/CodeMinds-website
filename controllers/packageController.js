const Package = require("../models/package");
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Create a new package
exports.createPackage = asyncHandler(async (req, res) => {
    // Filter the body to include only allowed fields
    const { courseId, price, sessionPerMonth, numberOfMonths } = req.body;

    const package = await Package.create({
        course: courseId,
        price,
        sessionPerMonth,
        numberOfMonths,
    });

    res.status(201).json({
        success: true,
        data: package,
        message: 'Package created successfully'
    });
});

// Get all packages
exports.getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find().populate('course', 'title');
    res.status(200).json({
        success: true,
        count: packages.length,
        data: packages
    });
});

// Get single package
exports.getPackage = asyncHandler(async (req, res) => {
    const package = await Package.findById(req.params.id).populate('course', 'title');
    if (!package) {
        throw new AppError('Package not found', 404);
    }
    res.status(200).json({
        success: true,
        data: package
    });
});

// Update package
exports.updatePackage = asyncHandler(async (req, res) => {
    let package = await Package.findById(req.params.id);
    if (!package) {
        throw new AppError('Package not found', 404);
    }

    // Filter the body to allow only specific fields and trigger 'save' middleware
    const { courseId, price, sessionPerMonth, numberOfMonths } = req.body;
    package.course = courseId;
    package.price = price;
    package.sessionPerMonth = sessionPerMonth;
    package.numberOfMonths = numberOfMonths;
    await package.save();

    res.status(200).json({
        success: true,
        data: package,
        message: 'Package updated successfully'
    });
});

// Delete package
exports.deletePackage = asyncHandler(async (req, res) => {
    const package = await Package.findByIdAndDelete(req.params.id);
    if (!package) {
        throw new AppError('Package not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Package deleted successfully'
    });
});
