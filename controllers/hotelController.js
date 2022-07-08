const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Hotel = require("../models/Hotel");

const queryConstructor = (queryString) => {
  let queryObj = {};
  if (queryString.featured) {
    queryObj.featured = queryString.featured;
  }
  if (queryString.type) {
    queryObj.featured = queryString.type;
  }
  if (queryString.city) {
    queryObj.city = queryString.city;
  }
  if (queryString.distance) {
    queryObj.distance = queryString.distance;
  }
  if (queryString.min) {
    queryObj.cheapestPrice = { $gt: +queryString.min };
  }
  if (queryString.max) {
    queryObj.cheapestPrice = { $lt: +queryString.max };
  }
  return queryObj;
};

const addHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  const hotel = await newHotel.save();

  res.status(StatusCodes.CREATED).json(hotel);
};
const updateHotel = async (req, res, next) => {
  const id = req.params.id;

  const hotel = await Hotel.findById(id);

  if (!hotel)
    throw new CustomError.NotFoundError(
      "The requested resource to update was not found"
    );

  const updatedHotel = await Hotel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.CREATED).json({ hotel: updatedHotel });
};

const deleteHotel = async (req, res, next) => {
  const id = req.params.id;

  const hotel = await Hotel.findById(id);

  if (!hotel)
    throw new CustomError.NotFoundError(
      "The requested resource to delete was not found"
    );

  await Hotel.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "Hotel has been successfully deleted",
  });
};

const getHotels = async (req, res, next) => {
  const hotels = await Hotel.find(queryConstructor(req.query)).limit(
    req.query.limit || 10
  );

  res.status(StatusCodes.OK).json({
    status: "Success",
    hotels,
  });
};

const countHotelsByCity = async (req, res, next) => {
  // Have to make sure the cities are in title case
  const cities = req.query.cities.split(",");

  const cityPromises = cities.map(
    async (city) => await Hotel.countDocuments({ city: city })
  );

  let obj = {};

  Promise.all(cityPromises)
    .then((numbers) => {
      numbers.forEach((number, i) => {
        obj[cities[i]] = number;
      });
      return res.json({
        cities: { ...obj },
        status: "Success",
      });
    })
    .catch((err) => {
      throw new CustomError.CustomAPIError(
        "Error while fetching the hotels by city"
      );
    });
};
const getHotelById = async (req, res, next) => {
  const id = req.params.id;

  const hotel = await Hotel.findById(id);

  if (!hotel)
    throw new CustomError.NotFoundError(
      `The hotel with id ${id} does not exist`
    );

  res.status(StatusCodes.OK).json({
    status: "Success",
    hotel,
  });
};

const countHotelsByType = async (req, res, json) => {
  const hotels = await Hotel.countDocuments({ type: "Hotel" });
  const apartments = await Hotel.countDocuments({ type: "Aparement" });
  const resorts = await Hotel.countDocuments({ type: "Resort" });
  const villas = await Hotel.countDocuments({ type: "Villa" });
  const cabins = await Hotel.countDocuments({ type: "Cabin" });

  return res.status(200).json({
    hotels,
    apartments,
    resorts,
    villas,
    cabins,
    status: "Success",
  });
};

module.exports = {
  addHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  countHotelsByCity,
  countHotelsByType,
  getHotelById,
};
