declare namespace tsParticles {
  interface ParticlesConfig {
    background?: {
      color?: string;
    };
    particles?: {
      number?: {
        value?: number;
      };
      color?: {
        value?: string;
      };
      move?: {
        enable?: boolean;
        speed?: number;
        direction?: string;
        random?: boolean;
        straight?: boolean;
        outModes?: string;
        attract?: {
          enable?: boolean;
          rotateX?: number;
          rotateY?: number;
        };
      };
      links?: {
        enable?: boolean;
        distance?: number;
        color?: string;
        opacity?: number;
        width?: number;
      };
      size?: {
        value?: number;
        random?: boolean;
      };
    };
    interactivity?: {
      events?: {
        onHover?: {
          enable?: boolean;
          mode?: string;
        };
        onClick?: {
          enable?: boolean;
          mode?: string;
        };
      };
      modes?: {
        repulse?: {
          distance?: number;
        };
        push?: {
          quantity?: number;
        };
      };
    };
  }

  function load(elementId: string, config: ParticlesConfig): any;
}
