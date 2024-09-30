import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:8080/api/loans';  // Your backend API

  constructor(private http: HttpClient) {}

  // POST request for registering a new loan
  registerLoan(loanData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loanData);
  }

  // GET request for fetching loans
  getLoans(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
