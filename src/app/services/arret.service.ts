import { Injectable } from '@angular/core';
import axios from 'axios';
import { Arret } from '../models/arret.model';

@Injectable({
  providedIn: 'root'
})
export class ArretService {
  private apiUrl = 'http://localhost:5000/api/arrets'; // Assurez-vous que votre API tourne sur ce port

  constructor() { }

  async createArret(arret: Arret): Promise<any> {
    try {
      // Formatage des données pour MongoDB
      const arretData = {
        nom: arret.nom,
        position: {
          type: 'Point',
          coordinates: arret.position.coordinates
        },
        bus: arret.bus || [] // Initialise un tableau vide si bus n'est pas défini
      };

      const response = await axios.post(this.apiUrl, arretData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'arrêt:', error);
      throw error;
    }
  }

  updateArret(id: string, arret: Arret) {
    return axios.put(`${this.apiUrl}/${id}`, arret);
  }

  deleteArret(id: string) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }
}
