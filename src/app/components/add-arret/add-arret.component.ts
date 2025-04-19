import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Arret } from '../../models/arret.model';

// Correction pour l'option tap
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

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Configuration de la carte avec l'option tap
    this.map = L.map('map', {
      zoomControl: true,
      preferCanvas: true,
      tap: false // Désactive le délai tactile pour Ionic
    }).setView([14.6928, -17.4467], 13);

    // Couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Gestion du clic sur la carte
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.placeMarker(e.latlng);
      this.showForm = true;
    });

    // Forcer le redimensionnement initial
    setTimeout(() => this.map.invalidateSize(), 100);
  }

  private placeMarker(latlng: L.LatLng): void {
    // Supprimer le marqueur existant
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Créer un marqueur personnalisé rouge avec Font Awesome
    const redMarkerIcon = L.divIcon({
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

    // Ajouter le nouveau marqueur
    this.marker = L.marker(latlng, {
      icon: redMarkerIcon,
      draggable: true
    }).addTo(this.map);

    // Mettre à jour les coordonnées
    this.updatePosition(latlng);

    // Gestion du déplacement du marqueur
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

  addArret(): void {
    if (!this.arret.nom.trim()) return;

    console.log('Arrêt enregistré:', this.arret);
    this.closeForm();
    this.arret.nom = '';
  }
}