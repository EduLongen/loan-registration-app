import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';  // Import MatDialogModule
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../../services/loan.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-loan-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './loan-registration.component.html',
  styleUrls: ['./loan-registration.component.scss']
})
export class LoanRegistrationComponent implements OnInit {
  loanForm: FormGroup;
  currencies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private currencyService: CurrencyService,
    private dialog: MatDialog
  ) {
    this.loanForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      loanDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      interestRate: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.currencyService.getCurrencyList().subscribe({
      next: (data) => {
        this.currencies = Object.entries(data).map(([key, value]) => ({ code: key, name: value }));
      },
      error: (error) => {
        console.error('Erro ao buscar moedas:', error);
      }
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
      this.loanService.registerLoan(loanData).subscribe({
        next: (response) => {
          this.openDialog('Empréstimo registrado com sucesso!');
        },
        error: (error) => {
          // Extract the backend error message if it exists
          const errorMessage = error?.error?.message || 'Erro desconhecido ao registrar o empréstimo';
          this.openErrorDialog(`${errorMessage}`);
        }
      });
    } else {
      this.loanForm.markAllAsTouched();
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
    const control = this.loanForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
