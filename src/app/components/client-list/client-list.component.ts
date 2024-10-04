import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})

export class ClientListComponent implements OnInit {
  clients: any[] = [];
  errorMessage: string | null = null;

  constructor(private clientService: ClientService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Erro ao buscar clientes', error);
        this.openErrorDialog('Erro ao buscar clientes.');
      }
    });
  }

  deleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        console.log('Cliente excluído com sucesso');
        this.openSuccessDialog('Cliente excluído com sucesso.');
        this.loadClients();
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Resposta completa de erro:', error);
        console.log('Corpo do erro:', error.error);
  
        let errorMessage = 'Ocorreu um erro inesperado ao excluir o cliente.';
  
        if (error.status === 400 && error.error) {
          if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              errorMessage = parsedError.error || 'Ocorreu um erro inesperado.';
            } catch (e) {
              errorMessage = error.error;
            }
          } else if (error.error.error) {
            errorMessage = error.error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }
  
        this.openErrorDialog(errorMessage);
      }
    });
  }  

  openSuccessDialog(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      data: { successMessage: message }
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { errorMessage: message }
    });
  }
}
