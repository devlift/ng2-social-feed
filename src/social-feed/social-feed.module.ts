import { NgModule, Injector } from "@angular/core";
import { JsonpModule } from "@angular/http";
import { ServiceLocator } from "./locator.service";

@NgModule({
  imports: [JsonpModule],
  exports: [],
  declarations: [],
  providers: []
})
export class SocialFeedModule {
  constructor(private injector: Injector) {
    // Create global Service Injector.
    ServiceLocator.injector = this.injector;
  }
}
