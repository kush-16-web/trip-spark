import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getHotelLiveDetails(hotelName: string, city: string) {
    try{
        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
            {
                params: {
                    input: `${hotelName} in ${city}`,
                    inputtype: 'textquery',
                    fields: 'place_id,name,formatted_address,geometry',
                    key: GOOGLE_API_KEY,
                },
            }
        );
        const placeId = searchResponse.data.candidates?.[0]?.place_id;

        if(!placeId) return null;
    const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json',{
      params: {
        place_id: placeId,
        fields: 'name,rating,user_ratings_total,formatted_address,url,photos,geometry',
        key: GOOGLE_API_KEY,
      },
    });

    console.log("GOOGLE DETAILS RESPONSE:", detailsResponse.data);

    if (detailsResponse.data.status !== "OK") {
      console.error("GOOGLE DETAILS ERROR STATUS:", detailsResponse.data.status, detailsResponse.data.error_message);
    }

    const result = detailsResponse.data.result;
    
    if (!result) return null;

    return {
      name: result.name,
      rating: result.rating,
      userRatingsTotal: result.user_ratings_total,
      address: result.formatted_address,
      mapUrl: result.url,
      photoReference: result.photos?.[0]?.photo_reference,
      lat: result.geometry?.location?.lat,
      lng: result.geometry?.location?.lng,
    }
        
    }catch(error){
        console.error('Error fetching hotel details:', error);
        return null;
    }
}