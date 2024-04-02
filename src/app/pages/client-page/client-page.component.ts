import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from '../../components/inputs/client/client.component';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ClientComponent],
})
export class ClientPageComponent {}
