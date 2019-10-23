import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '@app/common';

@Component({
  selector: 'dyn',
  templateUrl: './dyn.component.html',
  styleUrls: ['./dyn.component.css']
})
export class DynComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit, AfterViewChecked {

  @Input()
  someInput: string;

  @Output()
  someOutput: EventEmitter<Date> = new EventEmitter<Date>();

  title = 'angular-cli-app-with-rollup';

  valueFromService: number;

  constructor(private service: CommonService) {
    this.valueFromService = service.getRandomNumber();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('DynComponent ngOnChanges: ', changes);
  }

  ngOnInit(): void {
    setInterval(() => {
      this.someOutput.emit(new Date());
    }, 10000);
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }
}
