import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Arret } from '../../models/arret.model';
import { ArretService } from '../../services/arret.service';
import { ToastController } from '@ionic/angular';

declare module 'leaflet' {
  interface MapOptions {
    tap?: boolean;
  }
}

@Component({
  selector: 'app-add-arret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-arret.component.html',
  styleUrls: ['./add-arret.component.scss']
})
export class AddArretComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;
  showForm = false;

  arret: Arret = {
    nom: '',
    position: {
      type: 'Point',
      coordinates: []
    }
  };

  constructor(
    private arretService: ArretService,
    private toastController: ToastController
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: true,
      preferCanvas: true,
      tap: false
    }).setView([14.6928, -17.4467], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.placeMarker(e.latlng);
      this.showForm = true;
    });

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  private placeMarker(latlng: L.LatLng): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    const icon = L.divIcon({
      html: `
        <div style="color: #ff0000; font-size: 2rem; position: relative;">
          <i class="fas fa-map-marker-alt"></i>
          <div style="position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      className: 'custom-marker-icon',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    this.marker = L.marker(latlng, {
      icon,
      draggable: true
    }).addTo(this.map);

    this.updatePosition(latlng);

    this.marker.on('dragend', (e) => {
      this.updatePosition(e.target.getLatLng());
    });
  }

  private updatePosition(latlng: L.LatLng): void {
    this.arret.position.coordinates = [latlng.lng, latlng.lat];
  }

  closeForm(): void {
    this.showForm = false;
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null!;
    }
  }

  removeMarker(): void {
    this.closeForm();
    this.arret.nom = '';
  }

  async addArret(): Promise<void> {
    if (!this.arret.nom.trim()) {
      this.showToast('Veuillez donner un nom à l\'arrêt', 'warning');
      return;
    }

    if (!this.arret.position.coordinates.length) {
      this.showToast('Veuillez sélectionner un emplacement', 'warning');
      return;
    }

    try {
      await this.arretService.createArret(this.arret);
      this.showToast('Arrêt enregistré avec succès!', 'success');
      this.closeForm();
      this.arret.nom = '';
    } catch (error) {
      console.error('Erreur création arrêt:', error);
      this.showToast('Erreur lors de l\'enregistrement', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}