import Place from "@/db/models/Place";
import dbConnect from "@/db/connect.js";

export default async function handler(request, response) {
  const { id } = request.query;
  await dbConnect();

  if (!id) {
    return response.status(400).json({ status: "ID is required" });
  }

  if (request.method === "GET") {
    try {
      const place = await Place.findById(id);
      if (!place) {
        return response.status(404).json({ status: "Not Found" });
      }
      return response.status(200).json(place);
    } catch (error) {
      return response
        .status(500)
        .json({ status: "Internal Server Error", error: error.message });
    }
  } else if (request.method === "PATCH") {
    try {
      const placeData = request.body;
      const updatedPlace = await Place.findByIdAndUpdate(id, placeData, {
        new: true,
      });
      if (!updatedPlace) {
        return response.status(404).json({ status: "Not Found" });
      }
      return response
        .status(200)
        .json({ status: `Place ${id} updated!`, place: updatedPlace });
    } catch (error) {
      return response
        .status(500)
        .json({ status: "Internal Server Error", error: error.message });
    }
  } else if (request.method === "DELETE") {
    await Place.findByIdAndDelete(id);

    response.status(200).json({ status: `Place ${id} successfully deleted.` });
  } else {
    return response.status(405).json({ status: "Method not allowed" });
  }
}
