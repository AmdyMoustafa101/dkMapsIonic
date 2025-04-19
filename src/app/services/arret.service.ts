import { Injectable } from '@angular/core';
import axios from 'axios';
import { Arret } from '../models/arret.model';

@Injectable({
  providedIn: 'root'
})
export class ArretService {
  private apiUrl = 'http://localhost:5000/api/arret';

  constructor() { }

  async createArret(arret: Arret): Promise<any> {
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
      console.error('Error creating arret:', error);
      throw error;
    }
  }

  async updateArret(id: string, arret: Arret): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, arret);
      return response.data;
    } catch (error) {
      console.error('Error updating arret:', error);
      throw error;
    }
  }

  async deleteArret(id: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting arret:', error);
      throw error;
    }
  }
}