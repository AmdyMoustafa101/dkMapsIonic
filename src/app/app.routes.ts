import { Routes } from '@angular/router';
import { AddArretComponent } from './components/add-arret/add-arret.component';

export const routes: Routes = [
  {
    path: 'arret',
    component: AddArretComponent,
  },
  {
    path: '',
    redirectTo: '/arret',
    pathMatch: 'full',
  },
];
