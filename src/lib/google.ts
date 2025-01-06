'use server';

import { Client, PlaceAutocompleteType } from '@googlemaps/google-maps-services-js';
import { v4 as uuidv4 } from "uuid";

const sessionToken = uuidv4();

const client = new Client();

export const autocomplete = async (input: string) => {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        language: "es",
        types: "establishment" as PlaceAutocompleteType,
        sessiontoken: sessionToken,
      }
    })

    return response.data.predictions
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export const getPlaceDetails = async (placeId: string) => {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    }
  });

  const location = response.data.result.geometry?.location;
  return {
    location,
    address: response.data.result.formatted_address,
  };
};