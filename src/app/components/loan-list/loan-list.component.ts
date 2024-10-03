import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  loans: any[] = [];
  brlConversionRates: { [key: string]: number } = {};  // Store conversion rates to BRL

  constructor(private loanService: LoanService, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadBRLConversionRates();  // Load BRL conversion rates on component initialization
  }

  loadLoans() {
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
      }
    });
  }

  loadBRLConversionRates() {
    this.currencyService.getBRLConversionRates().subscribe({
      next: (data) => {
        this.brlConversionRates = data;
      },
      error: (error) => {
        console.error('Error loading BRL conversion rates:', error);
      }
    });
  }

  // Helper function to return the correct currency symbol based on the currency code
  getCurrencySymbol(currencyCode: string): string {
    switch (currencyCode) {
      case 'USD':
        return 'USD';
      case 'EUR':
        return 'EUR';
      case 'GBP':
        return 'GBP';
      case 'AUD':
        return 'AUD';
      case 'CHF':
        return 'CHF';
      case 'BRL':
        return 'BRL';
      default:
        return ''; 
    }
  }

  // Calculate total amount in BRL using the conversion rates
  calculateTotalInBRL(totalAmount: number, currencyCode: string): number {
    const conversionRate = this.brlConversionRates[currencyCode] || 1;  // Fallback to 1 if no rate is found
    return totalAmount * conversionRate;
  }

  // Get the exchange rate for a specific currency to BRL
  getExchangeRateToBRL(currencyCode: string): number {
    return this.brlConversionRates[currencyCode] || 1;  // Fallback to 1 if no rate is found
  }
}
