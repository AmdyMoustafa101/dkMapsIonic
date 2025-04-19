import { Injectable } from '@angular/core';
import axios from 'axios';
import { Arret } from '../models/arret.model';

@Injectable({
  providedIn: 'root'
})
export class ArretService {
  private apiUrl = 'http://localhost:5000/api/arret';

  constructor() { }

  // Récupérer tous les arrêts
  async getArrets(): Promise<Arret[]> {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement arrêts:', error);
      return [];
    }
  }

  // Créer un nouvel arrêt
  async createArret(arret: Arret): Promise<Arret> {
    try {
      const response = await axios.post(this.apiUrl, {
        nom: arret.nom,
        position: {
          type: 'Point',
          coordinates: arret.position.coordinates
        },
        bus: []
      });
      return response.data;
    } catch (error) {
      console.error('Erreur création arrêt:', error);
      throw error;
    }
  }

  // Mettre à jour un arrêt existant
  async updateArret(arret: Arret): Promise<Arret> {
    try {
      const response = await axios.put(`${this.apiUrl}/${arret._id}`, {
        nom: arret.nom,
        position: {
          type: 'Point',
          coordinates: arret.position.coordinates
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour arrêt:', error);
      throw error;
    }
  }

  // Supprimer un arrêt
  async deleteArret(id: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression arrêt:', error);
      throw error;
    }
  }
}
