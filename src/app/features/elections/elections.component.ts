import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Candidate {
  id: number;
  name: string;
  party: string;
  slogan: string;
  description: string;
  imageUrl: string;
  proposals: string[];
  experience: string;
  featured?: boolean;
}

@Component({
  selector: 'app-elections',
  imports: [CommonModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ElectionsComponent implements OnInit {
  candidates: Candidate[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCandidates();
  }

  private loadCandidates() {
    this.candidates = [
      {
        id: 1,
        name: 'María Elena Rodríguez',
        party: 'Partido Progresista',
        slogan: 'Tecnología para el Futuro',
        description: 'Ingeniera en sistemas con 15 años de experiencia en políticas públicas de innovación y desarrollo tecnológico.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Digitalización del Estado', 'Educación STEM', 'Innovación Industrial'],
        experience: 'Ex-Ministra de Ciencia y Tecnología',
        featured: true
      },
      {
        id: 2,
        name: 'Carlos Alberto Mendoza',
        party: 'Alianza Nacional',
        slogan: 'Unidad y Progreso',
        description: 'Economista y político con amplia trayectoria en gestión pública y desarrollo económico sostenible.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Crecimiento Económico', 'Empleo Juvenil', 'Infraestructura'],
        experience: 'Ex-Gobernador y Senador'
      },
      {
        id: 3,
        name: 'Ana Patricia Silva',
        party: 'Movimiento Verde',
        slogan: 'Sostenibilidad y Justicia',
        description: 'Abogada ambientalista con doctorado en políticas públicas, especializada en desarrollo sostenible.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Energías Renovables', 'Protección Ambiental', 'Justicia Social'],
        experience: 'Activista y Académica'
      },
      {
        id: 4,
        name: 'Roberto Torres Vega',
        party: 'Partido Liberal',
        slogan: 'Libertad y Oportunidades',
        description: 'Empresario y político con experiencia en el sector privado y la administración pública.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Libre Mercado', 'Reducción de Impuestos', 'Emprendimiento'],
        experience: 'Ex-Ministro de Economía'
      },
      {
        id: 5,
        name: 'Patricia Vega Morales',
        party: 'Frente Social',
        slogan: 'Por la Gente',
        description: 'Trabajadora social y política con enfoque en derechos humanos y políticas sociales inclusivas.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Salud Universal', 'Educación Gratuita', 'Vivienda Digna'],
        experience: 'Ex-Alcaldesa y Diputada'
      },
      {
        id: 6,
        name: 'Miguel Santos Herrera',
        party: 'Partido Conservador',
        slogan: 'Tradición y Valores',
        description: 'Abogado constitucionalista con amplia experiencia en el poder judicial y la administración pública.',
        imageUrl: 'assets/images/images.webp',
        proposals: ['Seguridad Ciudadana', 'Familia y Valores', 'Estado de Derecho'],
        experience: 'Ex-Magistrado y Ministro'
      }
    ];
  }

  viewCandidate(candidate: Candidate) {
    this.router.navigate(['/candidate', candidate.id]);
  }

  trackByCandidateId(index: number, candidate: Candidate): number {
    return candidate.id;
  }
}
