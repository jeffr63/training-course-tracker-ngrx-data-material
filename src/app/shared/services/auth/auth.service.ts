import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

class AuthToken {
  token: string;
  role: string;
  id: number;
  expires: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);

  readonly #isAdmin = signal<boolean>(false);
  readonly #isLoggedIn = signal<boolean>(false);
  public isLoggedIn = this.#isLoggedIn.asReadonly();
  public isLoggedInAsAdmin = computed(() => this.#isLoggedIn() && this.#isAdmin());

  public login(email: string, password: string) {
    return this.#http.post<any>('http://localhost:3000/login', { email, password }).pipe(
      map((response) => {
        // login successful if there's a jwt token in the response and if that token is valid
        if (response && response.accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          const token = this.parseJwt(response.accessToken);
          const auth: AuthToken = {
            token: response.accessToken,
            role: response.user.role,
            id: response.user.id,
            expires: token.exp,
          };
          localStorage.setItem('tct_auth', JSON.stringify(auth));
          this.#isLoggedIn.set(true);
          this.#isAdmin.set(response.user.role === 'admin' ? true : false);
        }
        return response;
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('tct_auth');
    this.#isLoggedIn.set(false);
    this.#isAdmin.set(false);
  }

  public checkLogin() {
    let auth: AuthToken = JSON.parse(localStorage.getItem('tct_auth'));
    if (!auth) return;

    let now = Date.now() / 1000;
    if (auth.expires > now) {
      this.#isLoggedIn.set(true);
      this.#isAdmin.set(auth.role === 'admin' ? true : false);
      // !!letting token expire after jwt expires
      // keep logged in for another hour
      // auth.expires = auth.expires + 3600;
      // localStorage.setItem('tct_auth', JSON.stringify(auth));
    } else {
      this.logout();
    }
  }

  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
