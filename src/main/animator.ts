import { BrowserWindow } from 'electron';

interface SpringConfig {
  stiffness: number; // Spring stiffness constant
  damping: number; // Damping coefficient
  mass: number; // Mass of the system
  precision: number; // Animation completion threshold
}

export class WindowAnimator {
  private window: BrowserWindow;
  private currentHeight: number;
  private targetHeight: number;
  private velocity: number = 0;
  private animationFrameId: NodeJS.Timeout | null = null;
  private lastTime: number = Date.now();

  private config: SpringConfig = {
    stiffness: 300, // Higher values = stiffer spring
    damping: 25, // Higher values = more damping
    mass: 1, // Higher values = more inertia
    precision: 0.1, // Lower values = more precise end position
  };

  constructor(window: BrowserWindow, config?: Partial<SpringConfig>) {
    this.window = window;
    this.currentHeight = window.getSize()[1];
    this.targetHeight = this.currentHeight;

    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Animate the window to a new height using spring physics
   * @param targetHeight The desired final height of the window
   */
  public animateTo(targetHeight: number): void {
    // Update target height
    this.targetHeight = targetHeight;

    // If not already animating, start the animation loop
    if (!this.animationFrameId) {
      this.lastTime = Date.now();
      this.startAnimation();
    }
  }

  /**
   * Stop any ongoing animation
   */
  public stop(): void {
    if (this.animationFrameId) {
      clearTimeout(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private startAnimation(): void {
    const update = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
      this.lastTime = currentTime;

      // Calculate spring force using Hooke's law: F = -kx
      const displacement = this.currentHeight - this.targetHeight;
      const springForce = -this.config.stiffness * displacement;

      // Calculate damping force: F = -cv
      const dampingForce = -this.config.damping * this.velocity;

      // Calculate acceleration: F = ma
      const acceleration = (springForce + dampingForce) / this.config.mass;

      // Update velocity: v = v0 + at
      this.velocity += acceleration * deltaTime;

      // Update position: x = x0 + vt
      this.currentHeight += this.velocity * deltaTime;

      // Update window size
      this.window.setSize(
        this.window.getSize()[0],
        Math.round(this.currentHeight),
      );

      // Check if animation should continue
      const isMoving = Math.abs(this.velocity) > this.config.precision;
      const isAtTarget = Math.abs(displacement) > this.config.precision;

      if (isMoving || isAtTarget) {
        // Continue animation
        this.animationFrameId = setTimeout(update, 1000 / 60); // Target 60 FPS
      } else {
        // End animation
        this.window.setSize(
          this.window.getSize()[0],
          Math.round(this.targetHeight),
        );
        this.currentHeight = this.targetHeight;
        this.velocity = 0;
        this.animationFrameId = null;
      }
    };

    update();
  }

  /**
   * Update the spring configuration
   * @param newConfig Partial spring configuration to update
   */
  public updateConfig(newConfig: Partial<SpringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get the current spring configuration
   */
  public getConfig(): SpringConfig {
    return { ...this.config };
  }
}
