import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule for ngFor
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true, // Indicates this is a standalone component
  imports: [CommonModule],  // <-- Add CommonModule here for ngFor
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})

export class ClientListComponent implements OnInit {
  clients: any[] = [];
  errorMessage: string | null = null; // To store the error message

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
      }
    });
  }

  deleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        console.log('Client deleted successfully');
        this.loadClients();  // Refresh the list after deletion
        this.errorMessage = null;  // Clear any previous error
      },
      error: (error) => {
        console.error('Full error response:', error);  // Log the full error for debugging
        console.log('Error body:', error.error); // Log the error body
  
        // Ensure the response is parsed correctly
        if (error.status === 400 && error.error) {
          if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);  // Try to parse it as JSON
              this.errorMessage = parsedError.error || 'An unexpected error occurred.';
            } catch (e) {
              // If parsing fails, treat it as a plain string
              this.errorMessage = error.error;
            }
          } else if (error.error.error) {
            // If it's already parsed as an object
            this.errorMessage = error.error.error;
          } else if (error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred while deleting the client.';
        }
      }
    });
  }  
   
}
