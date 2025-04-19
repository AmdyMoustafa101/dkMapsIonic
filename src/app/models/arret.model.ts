export interface Arret {
  _id?: string;
  nom: string;
  position: {
    type: string;
    coordinates: number[];
  };
  bus?: string[];
}