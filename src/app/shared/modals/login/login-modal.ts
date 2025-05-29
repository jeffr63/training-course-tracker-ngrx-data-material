import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { LoginModalContent } from './login-modal-content';

@Component({
  selector: 'app-login-modal',
  imports: [LoginModalContent],
  template: `<app-login-modal-content [(loginForm)]="loginForm" (cancel)="cancel()" (login)="login()" />`,
})
export class LoginModal implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<LoginModal>);
  readonly #fb = inject(FormBuilder);

  protected loginForm!: FormGroup;
  readonly #user = {
    email: '',
    password: '',
  };

  ngOnInit(): void {
    this.loginForm = this.#fb.group({
      email: ['', [Validators.required, , Validators.email]],
      password: ['', Validators.required],
    });
  }

  protected login(): void {
    if (this.loginForm.valid) {
      this.#user.email = this.loginForm.controls.email.value;
      this.#user.password = this.loginForm.controls.password.value;
      this.#dialogRef.close(this.#user);
    }
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
