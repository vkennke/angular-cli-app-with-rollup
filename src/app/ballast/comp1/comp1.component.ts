import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonService } from '@app/common';

@Component({
  selector: 'app-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit, OnChanges {

  valueFromService: number;

  constructor(private service: CommonService) {
    this.valueFromService = service.getRandomNumber();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Comp1Component ngOnChanges: ', changes);
  }

}
