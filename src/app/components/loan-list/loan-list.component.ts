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
  brlConversionRates: { [key: string]: number } = {};

  constructor(private loanService: LoanService, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadBRLConversionRates();
  }

  loadLoans() {
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
      },
      error: (error) => {
        console.error('Erro ao carregar empréstimos:', error);
      }
    });
  }

  loadBRLConversionRates() {
    this.currencyService.getBRLConversionRates().subscribe({
      next: (data) => {
        this.brlConversionRates = data;
      },
      error: (error) => {
        console.error('Erro ao carregar as taxas de conversão para BRL:', error);
      }
    });
  }

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

  calculateTotalInBRL(totalAmount: number, currencyCode: string): number {
    const conversionRate = this.brlConversionRates[currencyCode] || 1; 
    return totalAmount * conversionRate;
  }

  getExchangeRateToBRL(currencyCode: string): number {
    return this.brlConversionRates[currencyCode] || 1; 
  }
}
