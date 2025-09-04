import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedinUrl: string;
  description: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true
})
export class TeamComponent {
  
  activeDescription: number | null = null;
  
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Dr. Ana Martínez',
      role: 'Directora Ejecutiva',
      image: '/assets/images/loreipsum.webp',
      linkedinUrl: 'https://linkedin.com/in/ana-martinez',
      description: 'Especialista en derecho constitucional con más de 15 años de experiencia. Lidera iniciativas para promover la transparencia y el acceso a la justicia.'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      role: 'Director de Investigación',
      image: '/assets/images/loreipsum.webp',
      linkedinUrl: 'https://linkedin.com/in/carlos-rodriguez',
      description: 'Investigador experto en análisis de políticas públicas y reformas legales. Su trabajo se centra en la evaluación del impacto de las leyes en la sociedad.'
    },
    {
      id: 3,
      name: 'María González',
      role: 'Directora Legal',
      image: '/assets/images/loreipsum.webp',
      linkedinUrl: 'https://linkedin.com/in/maria-gonzalez',
      description: 'Abogada especializada en litigios estratégicos y derechos humanos. Coordina la representación legal de casos emblemáticos de interés público.'
    },
    {
      id: 4,
      name: 'Luis Fernández',
      role: 'Director de Comunicaciones',
      image: '/assets/images/loreipsum.webp',
      linkedinUrl: 'https://linkedin.com/in/luis-fernandez',
      description: 'Experto en comunicación estratégica y relaciones públicas. Desarrolla campañas para sensibilizar sobre la importancia del control ciudadano de la ley.'
    }
  ];

  toggleDescription(memberId: number): void {
    if (this.activeDescription === memberId) {
      this.activeDescription = null;
    } else {
      this.activeDescription = memberId;
    }
  }

  closeDescription(): void {
    this.activeDescription = null;
  }

  openLinkedIn(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
