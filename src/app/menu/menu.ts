import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { take } from 'rxjs';

import { AuthService } from '@services/auth/auth-service';
import { LoginModal } from '@modals/login/login-modal';
import { MenuToolbar } from './menu-toolbar';

@Component({
  selector: 'app-menu',
  imports: [MenuToolbar],
  template: `<app-menu-toolbar
    (login)="login()"
    (logout)="logout()"
    [isLoggedIn]="isLoggedIn()"
    [isLoggedInAsAdmin]="isLoggedInAsAdmin()" />`,
})
export class Menu {
  readonly #auth = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly #router = inject(Router);

  protected readonly isLoggedIn = this.#auth.isLoggedIn;
  protected readonly isLoggedInAsAdmin = this.#auth.isLoggedInAsAdmin;
  #email: string;
  #password: string;

  protected login() {
    const dialogRef = this.#dialog.open(LoginModal, {
      width: '500px',
      data: { email: this.#email, password: this.#password },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.#auth.login(result.email, result.password).pipe(take(1)).subscribe();
        },
      });
  }

  protected logout() {
    this.#auth.logout();
    this.#router.navigate(['/']);
  }
}
