import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul class="text-3xl flex flex-col gap-4">
      <li class="bg-orange-700">
        <a [routerLink]="['/lights_out_declarative']">Lights out imperative</a>
      </li>
      <li class="bg-orange-700">
        <a [routerLink]="['/lights_out_imperative']">Lights out declarative</a>
      </li>
      <li class="bg-orange-700">
        <a [routerLink]="['/generic-forms']">Generic Forms</a>
      </li>
    </ul>
  `,
})
export default class HomeComponent {
  links: { name: string; route: string }[] = [
    { name: 'Lights out imperative', route: 'lights-out-imperative' },
    { name: 'Lights out declarative', route: 'lights-out-imperative' },
    { name: 'Generic Forms', route: 'generic-forms' },
  ];
}
