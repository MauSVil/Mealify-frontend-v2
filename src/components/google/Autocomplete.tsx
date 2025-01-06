import { useDebounce } from "@uidotdev/usehooks";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { autocomplete, getPlaceDetails } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { useEffect, useState } from "react";

const Autocomplete = (
  { onChange, input, setInput }:
  {
    onChange: ({ lat, lng, address }: {lat?: number; lng?: number; address?: string }) => void;
    input: string;
    setInput: (input: string) => void;
  }
) => {
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    if (!input) {
      setPredictions([]);
    }
  }, [input])

  useEffect(() => {
    if (!debouncedInput) {
      return;
    }
    const fetchPredictions = async () => {
      const predictions = await autocomplete(debouncedInput);
      setPredictions(predictions ?? []);
    }
    fetchPredictions();
  }, [debouncedInput])

  const handleSelect = async (placeId: string) => {
    setInput("");
    const obj = await getPlaceDetails(placeId);
    onChange({
      lat: obj.location?.lat,
      lng: obj.location?.lng,
      address: obj.address,
    });
  };

  return (
    <Command>
      <CommandInput
        placeholder="Busca un lugar..."
        value={input}
        onValueChange={setInput}
      />
      <CommandList>
        <CommandGroup heading="Lugares">
          {predictions.map((prediction) => (
            <CommandItem key={prediction.place_id} onSelect={() => handleSelect(prediction.place_id)}>
              {prediction.description}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export default Autocomplete;