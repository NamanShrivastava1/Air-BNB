const propertyModel = require("../models/property.model");
const customError = require("../utils/customError");

const propertyCreateController = async (req, res, next) => {
  try {
    const { title, description, location, price, amenities, images } = req.body;
    if (
      !title &&
      !description &&
      !location &&
      !price &&
      !amenities &&
      !images
    ) {
      {
        return next(new customError("Please provide all required fields", 400));
      }
    }

    const newProperty = await propertyModel.create({
      title,
      description,
      location,
      price,
      amenities,
      images,
      host: req.user._id,
    });

    if (!newProperty) {
      return next(new customError("Property creation failed", 500));
    }
    res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (err) {
    return next(new customError(err.message, 500));
  }
};

const deletePropertyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new customError("Please provide property id", 400));
    }

    const deletedProperty = await propertyModel.findByIdAndDelete(id);

    if (!deletedProperty) {
      return next(new customError("Property deletion failed", 500));
    }

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    return next(new customError(err.message, 500));
  }
};

const updatePropertyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new customError("Please provide property id", 400));
    }

    const updatedProperty = await propertyModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProperty) {
      return next(new customError("Property update failed", 500));
    }

    res.status(200).json({
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    return next(new customError(err.message, 500));
  }
};

const viewPropertyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new customError("Please provide property id", 400));
    }

    const propertyDetails = await propertyModel.findById(id);
    if (!propertyDetails) {
      return next(new customError("Property not found", 404));
    }

    res.status(200).json({
      message: "Property details fetched successfully",
      data: propertyDetails,
    });
  } catch (error) {
    return next(new customError(err.message, 500));
  }
};

const searchPropertyController = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice } = req.body;

    const query = {
      ...(location && { location: { $regax: location, $options: "1" } }),
      ...(minPrice && { price: { $gte: minPrice } }),
      ...(maxPrice && { price: { $lte: maxPrice } }),
    };
    const property = await propertyModel.find(query);
    if (!property) {
      return next(new customError("Property not Found", 400));
    }
    res.status(200).json({
      message: "Properties fetched",
      data: property,
    });
  } catch (error) {}
};

module.exports = {
  propertyCreateController,
  deletePropertyController,
  updatePropertyController,
  viewPropertyController,
  searchPropertyController,
};
