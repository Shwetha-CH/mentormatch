// src/app/features/admin/components/stat-card/stat-card.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '📊';
  @Input() color: 'blue' | 'green' | 'purple' | 'orange' = 'blue';
}