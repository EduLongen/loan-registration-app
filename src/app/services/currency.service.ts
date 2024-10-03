import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = 'http://localhost:8080/api/currencies';

  constructor(private http: HttpClient) { }

  // Fetch the currency list
  getCurrencyList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // Fetch exchange rates for a currency within a date range
  getExchangeRates(currencyCode: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/exchange-rate`, {
      params: { currencyCode, startDate, endDate }
    });
  }

  // Fetch exchange rates to BRL for all currencies
  getBRLConversionRates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/to-brl`);
  }
}
