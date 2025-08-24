import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-fluid-background',
  templateUrl: './fluid-background.component.html',
  styleUrls: ['./fluid-background.component.css'],
  standalone: true,
})
export class FluidBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fluidContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  private vantaEffect: any = null;
  private mouse = { x: 0, y: 0, active: false };
  private animationId: number = 0;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseLeaveHandler: (() => void) | null = null;

  ngOnInit() {
    console.log('FluidBackgroundComponent ngOnInit');
  }

  ngAfterViewInit() {
    console.log('FluidBackgroundComponent ngAfterViewInit');
    this.initVantaFog();
    this.setupEventListeners();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.removeEventListeners();
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  private async initVantaFog() {
    try {
      // Cargar Three.js dinámicamente
      await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.134/build/three.min.js');
      
      // Cargar Vanta.js FOG dinámicamente
      await this.loadScript('https://cdn.jsdelivr.net/npm/vanta/dist/vanta.fog.min.js');
      
      // Inicializar Vanta FOG
      if ((window as any).VANTA) {
        this.vantaEffect = (window as any).VANTA.FOG({
          el: "#vanta-background",
          mouseControls: false, // Lo apagamos para hacer el empuje manual
          touchControls: true,
          gyroControls: false,
          highlightColor: 0x3399ff,
          midtoneColor: 0x0044ff,
          lowlightColor: 0x000000,
          baseColor: 0x111111,
          blurFactor: 0.5,
          speed: 1.0,
          zoom: 1.1
        });
        
        console.log('Vanta FOG inicializado correctamente');
        
        // Esperar a que Vanta esté completamente inicializado
        await this.waitForVantaReady();
      }
    } catch (error) {
      console.error('Error al cargar Vanta FOG:', error);
    }
  }

  private waitForVantaReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkReady = () => {
        if (this.vantaEffect && 
            this.vantaEffect.uniforms && 
            this.vantaEffect.uniforms.offset && 
            this.vantaEffect.uniforms.offset.value) {
          console.log('Vanta FOG completamente listo');
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).THREE && src.includes('three')) {
        resolve();
        return;
      }
      if ((window as any).VANTA && src.includes('vanta')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error cargando script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private setupEventListeners() {
    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.active = true;
    };
    
    this.mouseLeaveHandler = () => {
      this.mouse.active = false;
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  private removeEventListeners() {
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.mouseLeaveHandler) {
      window.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }
  }

  private animate() {
    try {
      if (this.vantaEffect && 
          this.vantaEffect.uniforms && 
          this.vantaEffect.uniforms.offset && 
          this.vantaEffect.uniforms.offset.value && 
          this.mouse.active) {
        // Efecto de choque/empuje del mouse en lugar de deformar la niebla
        const pushStrength = 0.05;
        this.vantaEffect.uniforms.offset.value.x += this.mouse.x * pushStrength;
        this.vantaEffect.uniforms.offset.value.y += this.mouse.y * pushStrength;
      }
    } catch (error) {
      console.error('Error en animate:', error);
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
