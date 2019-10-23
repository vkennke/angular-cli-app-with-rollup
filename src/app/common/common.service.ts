import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommonService {

  private randomNumber: number = Math.random();

  public getRandomNumber(): number {
    return this.randomNumber;
  }
}
