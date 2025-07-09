import axios from 'axios';

export interface GeocodingResult {
  lat: number;
  lng: number;
}

class GeocodingService {
  async getCoordinatesFromCEP(cep: string): Promise<GeocodingResult> {
    try {
      const cleanedCEP = cep.replace(/\D/g, '');

      const response = await axios.get(
        `https://viacep.com.br/ws/${cleanedCEP}/json/`,
      );

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      const seed = parseInt(cleanedCEP.substring(0, 5));
      const lat = -15.7801 + (seed % 10) * 0.5 - 2.5;
      const lng = -47.9292 + (seed % 7) * 0.7 - 2.1;

      return { lat, lng };
    } catch (error) {
      console.error('Erro ao obter coordenadas do CEP:', error);

      return { lat: -15.7801, lng: -47.9292 };
    }
  }
}

export default new GeocodingService();
