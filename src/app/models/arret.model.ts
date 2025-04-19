export interface Arret {
  nom: string;
  position: {
    type: string;
    coordinates: number[];
  };
  bus?: string[];
}