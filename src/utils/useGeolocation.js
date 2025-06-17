import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [geolocation, setGeoLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionStatusChecked, setPermissionStatusChecked] = useState(false);

  useEffect(() => {
    // Função de sucesso quando a geolocalização é obtida
    const getCoords = (position) => {
      setGeoLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setPermissionDenied(false);
      setPermissionStatusChecked(true);
    };

    // Função de erro caso o usuário não permita que algo aconteça
    const handleError = (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        setPermissionDenied(true);
        setPermissionStatusChecked(true);
      }
    };

    navigator.geolocation.getCurrentPosition(getCoords, handleError);
  }, []);

  return { geolocation, permissionDenied, permissionStatusChecked };
};

export default useGeolocation;
