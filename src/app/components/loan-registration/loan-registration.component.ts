import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-loan-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './loan-registration.component.html',
  styleUrls: ['./loan-registration.component.scss']
})
export class LoanRegistrationComponent implements OnInit {
  loanForm: FormGroup;
  currencies: any[] = [];  // To store the list of currencies

  constructor(private fb: FormBuilder, private loanService: LoanService, private currencyService: CurrencyService) {
    this.loanForm = this.fb.group({
      cpf: ['', [Validators.required]], 
      amount: ['', [Validators.required, Validators.min(1)]],
      loanDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Fetch the currency list on component initialization
    this.currencyService.getCurrencyList().subscribe({
      next: (data) => {
        // Transform the data received from the API into the expected format
        this.currencies = Object.entries(data).map(([key, value]) => ({ code: key, name: value }));
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
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

  isFieldInvalid(field: string): boolean {
    const control = this.loanForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
