// searchController.js
const Hotel = require("../models/hotelModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// const YOUR_GOOGLE_API_KEY = "AIzaSyBnD7klPbc9ApkZ5_ONxGsvhfZXjmGBbfg";
const API_KEY = process.env.GEMINI_KEY;

function parseToJSON(responseString) {
  try {
    // Remove extra characters like `'''json` and newlines
    const cleanedString = responseString
      .trim()
      .replace(/^```json\s*/g, "")
      .replace(/```\s*$/g, "");

    const jsonObject = JSON.parse(cleanedString);
    return jsonObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null; // Return null if there was an error in parsing
  }
}

// Helper function to call Gemini API and extract details
const extractSearchDetails = async (userPrompt) => {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Extract the city, price, rating, and amenities from the following text: ${userPrompt}. Output should be a JSON in the format - {"priceOperator": "greater", "price": 100,ratingOperator": "greater", "rating": 5, "amenities": ["WiFi", "Pool", "Restaurant"], "city": "indore"}, if you did not find any key then just show an empty string and in case of amenities an empty array, items in amenities can only contains these items : 'WiFi','Gym','Spa','Parking' 'Restaurant','Bar'. In priceOperator and ratingOperator only 1 out of these 4 values can be returned : 'greater', 'lower', 'equal', ''.`;

    const result = await model.generateContent(prompt);
    const parsedResult = parseToJSON(result.response.text());
    console.log(result.response.text());

    console.log(parsedResult);
    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not extract details from the prompt");
  }
};

// Search hotels based on the extracted details from the user input
const searchHotels = async (req, res) => {
  const { prompt } = req.body; // The search text from the front-end

  try {
    // Extract details from the prompt using Gemini API
    const { city, price, rating, amenities, priceOperator, ratingOperator } =
      await extractSearchDetails(prompt);

    // Construct a query for filtering hotels based on the extracted values
    const filterQuery = {};

    if (city) {
      filterQuery.city = { $regex: city, $options: "i" };
    }
    if (price !== undefined && price !== null) {
      switch (priceOperator) {
        case "greater":
          filterQuery.price = { $gt: price };
          break;
        case "lower":
          filterQuery.price = { $lt: price };
          break;
        case "equal":
          filterQuery.price = price;
          break;
        default:
          break;
      }
    }

    // Filter by rating
    if (rating !== undefined && rating !== null) {
      switch (ratingOperator) {
        case "greater":
          filterQuery.rating = { $gt: rating };
          break;
        case "lower":
          filterQuery.rating = { $lt: rating };
          break;
        case "equal":
          filterQuery.rating = rating;
          break;
        default:
          break;
      }
    }

    if (amenities.length > 0) filterQuery.amenities = { $in: amenities };

    // Find hotels based on the filter query
    const hotels = await Hotel.find(filterQuery);
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchHotels };
