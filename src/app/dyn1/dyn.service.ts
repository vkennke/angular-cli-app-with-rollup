import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynService {
    id = Math.floor(Math.random() * 100);
}
