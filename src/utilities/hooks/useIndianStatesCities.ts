import { useState, useEffect, useMemo } from 'react';
import { 
  INDIAN_STATES_CITIES, 
  getStateById, 
  getCitiesByStateId, 
  getAllStates,
  State,
  City 
} from '../data/indian-states-cities';

export interface UseIndianStatesCitiesProps {
  defaultState?: string;
  defaultCity?: string;
  onStateChange?: (stateId: string, stateName: string) => void;
  onCityChange?: (cityId: string, cityName: string) => void;
}

export interface UseIndianStatesCitiesReturn {
  // Data
  allStates: State[];
  availableCities: City[];
  selectedState: string | undefined;
  selectedCity: string | undefined;
  
  // Handlers
  handleStateChange: (stateId: string) => void;
  handleCityChange: (cityId: string) => void;
  resetSelection: () => void;
  
  // Computed values
  selectedStateData: State | undefined;
  selectedCityData: City | undefined;
  
  // Options for Ant Design Select components
  stateOptions: Array<{ label: string; value: string; type: string }>;
  cityOptions: Array<{ label: string; value: string; district?: string }>;
}

export const useIndianStatesCities = (props: UseIndianStatesCitiesProps = {}): UseIndianStatesCitiesReturn => {
  const {
    defaultState,
    defaultCity,
    onStateChange,
    onCityChange
  } = props;

  const [selectedState, setSelectedState] = useState<string | undefined>(defaultState);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(defaultCity);

  // Get all states data
  const allStates = useMemo(() => getAllStates(), []);

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    return getCitiesByStateId(selectedState);
  }, [selectedState]);

  // Get selected state data
  const selectedStateData = useMemo(() => {
    if (!selectedState) return undefined;
    return getStateById(selectedState);
  }, [selectedState]);

  // Get selected city data
  const selectedCityData = useMemo(() => {
    if (!selectedCity || !availableCities.length) return undefined;
    return availableCities.find(city => city.id === selectedCity);
  }, [selectedCity, availableCities]);

  // Create options for state select
  const stateOptions = useMemo(() => {
    const states = allStates.filter(state => state.type === 'state');
    const unionTerritories = allStates.filter(state => state.type === 'union_territory');

    return [
      // States first
      ...states.map(state => ({
        label: state.name,
        value: state.id,
        type: 'State'
      })),
      // Union territories after
      ...unionTerritories.map(ut => ({
        label: ut.name,
        value: ut.id,
        type: 'Union Territory'
      }))
    ];
  }, [allStates]);

  // Create options for city select
  const cityOptions = useMemo(() => {
    return availableCities.map(city => ({
      label: city.name,
      value: city.id,
      district: city.district
    }));
  }, [availableCities]);

  // Handle state selection change
  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
    setSelectedCity(undefined); // Reset city when state changes
    
    const stateData = getStateById(stateId);
    if (stateData && onStateChange) {
      onStateChange(stateId, stateData.name);
    }
  };

  // Handle city selection change
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    
    const cityData = availableCities.find(city => city.id === cityId);
    if (cityData && onCityChange) {
      onCityChange(cityId, cityData.name);
    }
  };

  // Reset both selections
  const resetSelection = () => {
    setSelectedState(undefined);
    setSelectedCity(undefined);
  };

  // Effect to handle default city when state changes
  useEffect(() => {
    if (selectedState && defaultCity) {
      const cities = getCitiesByStateId(selectedState);
      const cityExists = cities.some(city => city.id === defaultCity);
      if (cityExists) {
        setSelectedCity(defaultCity);
      }
    }
  }, [selectedState, defaultCity]);

  return {
    // Data
    allStates,
    availableCities,
    selectedState,
    selectedCity,
    
    // Handlers
    handleStateChange,
    handleCityChange,
    resetSelection,
    
    // Computed values
    selectedStateData,
    selectedCityData,
    
    // Options for Ant Design Select components
    stateOptions,
    cityOptions
  };
};
