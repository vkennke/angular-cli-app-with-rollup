import {
  Component,
  ɵNgModuleFactory as NgModuleFactory,
  Injector,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  SimpleChanges,
  SimpleChange, OnChanges, EventEmitter, OnInit
} from '@angular/core';
import { createCustomElement, NgElement } from '@angular/elements';

declare var System: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cli-app-with-rollup';

  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  private randomText: string = '';
  private dynamicComponent: ComponentRef<any>;
  private webElement: NgElement;

  constructor(private injector: Injector) {
  }

  public async showAsDynamicComponent() {
    if (!this.dynamicComponent) {
      const m = await this.loadModule();
      const moduleType = m['DynModule'];
      const moduleFactory = new NgModuleFactory(moduleType);
      const moduleRef = moduleFactory.create(this.injector);
      //By type:
      //let componentType = m['DynComponent'];
      //By selector:
      let componentType = this.findComponent(m, 'dyn');
      let componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);

      this.dynamicComponent = this.container.createComponent(componentFactory, 0, moduleRef.injector, null, moduleRef);
      this.setInputOnDynamicComponent('someInput', true);
      this.listenToOutputOnDynamicComponent('someOutput');
    }
  }

  public async showAsWebElement() {
    if (!this.webElement) {
      const module = await this.loadModule();
      const componentType = this.findComponent(module, 'dyn');
      const moduleType = module['DynModule'];
      const moduleFactory = new NgModuleFactory(moduleType);
      const moduleRef = moduleFactory.create(this.injector);
      const customElement = createCustomElement(componentType, {injector: moduleRef.injector});
      customElements.define('dyn-ele', customElement);
      this.webElement = document.createElement('dyn-ele') as any;

      this.setInputOnWebElement('someInput');
      this.listenToOutputOnWebElement('someOutput');
      this.addWebElementToDom();
    }
  }

  public showRandomInputText() {
    this.randomText = Math.random().toString(36).substring(7);

    if (this.dynamicComponent) {
      this.setInputOnDynamicComponent('someInput');
    }

    if (this.webElement) {
      this.setInputOnWebElement('someInput');
    }
  }

  // Here, "dyn" is resolved by the import map.
  // For a real plugin architecture, the mapping to the full bundle name would be driven by some metadata from the backend.
  private async loadModule() {
    return await System.import('dyn');
  }

  /**
   * Finds the component by selector within the ES Module.
   * For this, the component must be exported.
   * Formerly, we iterated over NgModule-Metadata to find the component. But they are subject to tree shaking (even the entry components !?!).
   * ngModuleDef is anyway an internal API, so better to avoid it...
   *
   * This uses the internal API ngComponentDef and may break!
   * Could by avoided by using type name instead.
   */
  private findComponent(esModule: any, componentSelector: string): any {
    return Object.keys(esModule)
      .map(k => esModule[k])
      .find((t: any) => t.ɵcmp && t.ɵcmp.selectors[0][0] === componentSelector);
  }

  private setInputOnWebElement(propName: string): void {
    this.webElement[propName] = this.randomText;
  }

  private listenToOutputOnWebElement(propName: string) {
    this.webElement.addEventListener(propName, (outputEvent: CustomEvent) => {
      console.log('outputEvent in webElement: ', outputEvent.detail);
    });
  }

  private addWebElementToDom() {
    //document.body.appendChild(element);
    const nativeElement = (this.container.element.nativeElement as HTMLElement);
    nativeElement.parentNode.replaceChild(this.webElement, nativeElement);
  }

  private setInputOnDynamicComponent(propName: string, firstChange: boolean = false): void {
    this.dynamicComponent.instance[propName] = this.randomText;
    let changes: SimpleChanges = {};
    changes[propName] = new SimpleChange(this.dynamicComponent.instance[propName], this.randomText, firstChange);
    (this.dynamicComponent.instance as OnChanges).ngOnChanges(changes);
    firstChange && (this.dynamicComponent.instance as OnInit).ngOnInit();
  }

  private listenToOutputOnDynamicComponent(propName: string) {
    (this.dynamicComponent.instance[propName] as EventEmitter<any>).subscribe(value => {
      console.log('outputEvent in dynamicComponent: ', value);
    });
  }
}
