import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from '../../inputs/client/client.component';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  standalone: true,
  imports: [CommonModule, ClientComponent],
})
export class ClientPageComponent {}
