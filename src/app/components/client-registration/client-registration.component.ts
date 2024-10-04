import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';  // Import MatDialogModule
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';  // Success dialog
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';  // Error dialog
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialog: MatDialog  // Inject MatDialog for dialog functionality
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      this.clientService.registerClient(clientData).subscribe({
        next: (response) => {
          this.openDialog('Cliente registrado com sucesso!');
        },
        error: (error) => {
          // Extract the backend error message if it exists
          const errorMessage = error?.error || 'Erro desconhecido ao registrar o cliente';
          this.openErrorDialog(`${errorMessage}`);
        }
      });
    } else {
      this.clientForm.markAllAsTouched();
    }
  }  

  openDialog(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      data: { successMessage: message }
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { errorMessage: message }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.clientForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
