import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './loan-registration.component.html',
  styleUrls: ['./loan-registration.component.scss']
})
export class LoanRegistrationComponent implements OnInit {
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.loanForm = this.fb.group({
      cpf: ['', [Validators.required]], 
      amount: ['', [Validators.required, Validators.min(1)]],
      loanDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

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
