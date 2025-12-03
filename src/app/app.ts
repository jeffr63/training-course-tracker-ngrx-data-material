import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './shared/services/auth/auth-service';
import { Menu } from './menu/menu';
import { PathData } from '@services/path/path-data';
import { SourceData } from '@services/source/source-data';

@Component({
  selector: 'app-root',
  imports: [Menu, RouterOutlet],
  template: `
    <app-menu></app-menu>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [],
})
export class App implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #pathService = inject(PathData);
  readonly #sourceService = inject(SourceData);

  ngOnInit() {
    this.#authService.checkLogin();
    this.#pathService.getAll();
    this.#sourceService.getAll();
  }
}
