import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DynService } from './dyn.service';

@Component({
  selector: 'dyn',
  templateUrl: './dyn.component.html'
})
export class DynComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit, AfterViewChecked {
  constructor(public dynService: DynService) {
  }

  @Input()
  someInput: string;

  @Output()
  someOutput: EventEmitter<Date> = new EventEmitter<Date>();

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
