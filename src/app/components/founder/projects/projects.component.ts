import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-founder-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = []; // Placeholder for projects
  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    // For now, it stays empty as per requirement (Empty state if no projects)
    // We can simulate an empty state or add a placeholder list
  }
}
