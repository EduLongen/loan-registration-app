import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients';  // Your backend API

  constructor(private http: HttpClient) {}

  // POST request for registering a new client
  registerClient(clientData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, clientData);
  }

  // GET request to fetch all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
