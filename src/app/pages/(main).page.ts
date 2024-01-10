import { Component, ɵɵpureFunction5 } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul class="text-3xl flex flex-col gap-4">
      <li><a [routerLink]="['/lights_out_declarative']">Lights out imperative</a></li>
      <li><a [routerLink]="['/lights_out_imperative']">Lights out declarative</a></li>
      <li><a>Generic Forms</a></li>
      <li></li>
    </ul>
  `,

})
export default class HomeComponent {
  links: { name: string, route: string }[] = [
    { name: 'Lights out imperative', route: 'lights-out-imperative' },
    { name: 'Lights out declarative', route: 'lights-out-imperative' },
    { name: 'Generic Forms', route: 'generic-forms' }
  ]


}
