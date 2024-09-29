import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-loan-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-registration.component.html',
  styleUrls: ['./loan-registration.component.scss']
})
export class LoanRegistrationComponent implements OnInit {
  loanForm: FormGroup;
  clients: any[] = [];
  selectedClientCpf: string | null = null;  // Use CPF instead of ID

  constructor(private fb: FormBuilder, private loanService: LoanService, private clientService: ClientService) {
    this.loanForm = this.fb.group({
      amount: ['', [Validators.required]],
      loanDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      cpf: ['', [Validators.required]]  // CPF input field
    });
  }

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  onSubmit() {
    if (this.loanForm.valid && this.selectedClientCpf) {
      const loanData = {
        ...this.loanForm.value,
        cpf: this.selectedClientCpf // Send CPF instead of Client ID
      };

      this.loanService.registerLoan(loanData).subscribe({
        next: (response) => {
          console.log('Loan registered successfully:', response);
        },
        error: (error) => {
          console.error('Error registering loan:', error);
        }
      });
    } else {
      this.loanForm.markAllAsTouched();
    }
  }

  onClientChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedClientCpf = target.value ? target.value : null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loanForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
