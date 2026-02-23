import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Project {
  id: number;
  title: string;
  category: string;
  categoryClass: string; // for styling the category tag
  description: string;
  status: 'live' | 'draft' | 'review' | 'funded';
  statusLabel: string;
  raised: number;
  goal: number;
  progress: number;
  headerClass: string; // for the card header background/gradient
  isNew?: boolean; // to identify the "New Project" card
}

@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.css']
})
export class MyProjectComponent {
  projects: Project[] = [
    {
      id: 1,
      title: 'EcoWater Solutions',
      category: 'Clean Tech',
      categoryClass: 'clean-tech',
      description: 'Developing sustainable, low-cost water filtration systems for rural communities.',
      status: 'live',
      statusLabel: 'live',
      raised: 85400,
      goal: 120000,
      progress: 71,
      headerClass: 'bg-blue-gradient'
    },
    {
      id: 2,
      title: 'EdTech for All',
      category: 'Education',
      categoryClass: 'education',
      description: 'A mobile-first platform connecting volunteer tutors with underprivileged students.',
      status: 'draft',
      statusLabel: 'DRAFT',
      raised: 0,
      goal: 50000,
      progress: 0,
      headerClass: 'bg-gray-gradient' // Placeholder/Light gray
    },
    {
      id: 3,
      title: 'Urban Gardens Initiative',
      category: 'Social Impact',
      categoryClass: 'social-impact',
      description: 'Transforming unused urban rooftops into community gardens to fight food insecurity.',
      status: 'funded',
      statusLabel: 'FUNDED',
      raised: 35000,
      goal: 30000,
      progress: 100, // Or more if funded implies > 100%
      headerClass: 'bg-purple-gradient'
    },
    {
      id: 4,
      title: 'MediConnect AI',
      category: 'Healthy Care',
      categoryClass: 'healthy-care',
      description: 'AI-driven diagnostic tools for early detection of diseases in low-resource settings.',
      status: 'live',
      statusLabel: 'live',
      raised: 60000,
      goal: 10000, // NOTE: Screenshot says / $10k but raised is 60k? Assuming typo in mock or successfully overfunded.
      progress: 50, // Screenshot says 50%
      headerClass: 'bg-green-gradient'
    },
    {
      id: 5,
      title: 'EcoFabrics',
      category: 'Fashion',
      categoryClass: 'fashion',
      description: 'Biodegradable fabric alternatives made from agricultural waste products.',
      status: 'review',
      statusLabel: 'REVIEW',
      raised: 0,
      goal: 70500,
      progress: 0,
      headerClass: 'bg-orange-gradient'
    },
    {
      id: 6,
      title: 'New Project',
      category: '',
      categoryClass: '',
      description: 'Start a new initiative and find Investors',
      status: 'draft', // Dummy status
      statusLabel: '',
      raised: 0,
      goal: 0,
      progress: 0,
      headerClass: '',
      isNew: true
    }
  ];
}
