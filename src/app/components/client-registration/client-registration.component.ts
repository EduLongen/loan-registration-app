import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent {
  clientForm: FormGroup;
  successMessage: string | null = null;  // Message for successful registration

  constructor(private fb: FormBuilder, private clientService: ClientService) {
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
          console.log('Client registered successfully:', response);
          this.successMessage = 'Client successfully registered!';
          this.clientForm.reset();  // Reset the form after successful submission
        },
        error: (error) => {
          console.error('Error registering client:', error);
          this.successMessage = null;  // Clear success message on error
        }
      });
    } else {
      this.clientForm.markAllAsTouched();  // Mark all fields as touched if invalid
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.clientForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
