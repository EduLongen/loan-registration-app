import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';  // Import NgClass from Angular
import { LoanService } from '../../services/loan.service';
import { CurrencyService } from '../../services/currency.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass],  // Add NgClass to the imports
  templateUrl: './loan-registration.component.html',
  styleUrls: ['./loan-registration.component.scss']
})
export class LoanRegistrationComponent implements OnInit {
  loanForm: FormGroup;
  currencies: any[] = [];

  constructor(private fb: FormBuilder, private loanService: LoanService, private currencyService: CurrencyService) {
    this.loanForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      loanDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      currency: ['', Validators.required],
      interestRate: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
    });
  }

  ngOnInit(): void {
    // Fetch the currency list on component initialization
    this.currencyService.getCurrencyList().subscribe({
      next: (data) => {
        this.currencies = Object.entries(data).map(([key, value]) => ({ code: key, name: value }));
      },
      error: (error) => {
        console.error('Erro ao buscar as moedas:', error);
      }
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value as Loan;
      this.loanService.registerLoan(loanData).subscribe({
        next: (response) => {
          console.log('Empréstimo registrado com sucesso:', response);
          alert('Empréstimo registrado com sucesso!');  // Display success popup
        },
        error: (error) => {
          console.error('Erro ao registrar o empréstimo:', error);
          alert('Erro ao registrar o empréstimo! Verifique os dados e tente novamente.');  // Display error popup
        }
      });
    } else {
      this.loanForm.markAllAsTouched();  // Trigger validation warnings
    }
  }  

  isFieldInvalid(field: string): boolean {
    const control = this.loanForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
