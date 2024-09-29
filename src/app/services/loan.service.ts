import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/api/loans';  // Replace with your Spring Boot backend URL

  constructor(private http: HttpClient) {}

  // Method to register a loan, including CPF
  registerLoan(loanData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loanData);
  }

  // Method to fetch all loans (optional)
  getLoans(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
