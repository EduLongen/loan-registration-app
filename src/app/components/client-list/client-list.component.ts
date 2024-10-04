import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})

export class ClientListComponent implements OnInit {
  clients: any[] = [];
  errorMessage: string | null = null;
  clientForm: FormGroup; // <-- FormGroup for updating client
  selectedClient: any = null; // <-- Store the selected client for update

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private fb: FormBuilder // <-- Inject FormBuilder for the form
  ) {
    this.clientForm = this.fb.group({
      id: [''], // <-- Hidden input for the client ID
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
    });
  }

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
        this.openSuccessDialog('Cliente excluído com sucesso.');
        this.loadClients();
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
        this.openErrorDialog('Erro ao excluir cliente.');
      }
    });
  }

  // Function to load the selected client's data into the form for editing
  editClient(client: any): void {
    this.selectedClient = client;
    this.clientForm.patchValue({
      id: client.id,
      name: client.name,
      lastName: client.lastName,
      cpf: client.cpf
    });
  }

  // Function to update the client with the new form values
  updateClient(): void {
    if (this.clientForm.valid) {
      const updatedClient = this.clientForm.value;
      this.clientService.updateClient(updatedClient).subscribe({
        next: () => {
          this.openSuccessDialog('Cliente atualizado com sucesso.');
          this.loadClients();
          this.clientForm.reset(); // Reset the form after updating
          this.selectedClient = null; // Clear selected client
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          this.openErrorDialog('Erro ao atualizar cliente.');
        }
      });
    } else {
      this.clientForm.markAllAsTouched();
    }
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
