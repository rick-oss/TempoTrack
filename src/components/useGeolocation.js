import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [geolocation, setGeoLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verifica se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    // Função de sucesso quando a geolocalização é obtida
    const getCoords = (position) => {
      setGeoLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    // Função de erro caso o usuário não permita que algo aconteça
    const handleError = (error) => {
      setError(`Erro ao pegar a localização: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(getCoords, handleError);
  }, []);

  return { geolocation, error };
};

export default useGeolocation;
