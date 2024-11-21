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
    precision: 0.1 // Lower values = more precise end position
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
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // Physics calculations
      const displacement = this.currentHeight - this.targetHeight;
      const springForce = -this.config.stiffness * displacement;
      const dampingForce = -this.config.damping * this.velocity;
      const acceleration = (springForce + dampingForce) / this.config.mass;

      this.velocity += acceleration * deltaTime;
      this.currentHeight += this.velocity * deltaTime;

      // Get current window metrics
      const [currentX, currentY] = this.window.getPosition();
      const [currentWidth, oldHeight] = this.window.getSize();
      const newHeight = Math.round(this.currentHeight);

      // Get screen metrics
      const screen = require('electron').screen;
      const display = screen.getDisplayMatching({
        x: currentX,
        y: currentY,
        width: currentWidth,
        height: oldHeight
      });

      // Calculate distances to screen edges
      const distanceToTop = currentY;
      const distanceToBottom = display.workArea.height - (currentY + oldHeight);

      // Determine whether to extend from top or bottom
      if (distanceToTop < distanceToBottom) {
        // Extend from bottom (maintain top position)
        this.window.setBounds({
          x: currentX,
          y: currentY,
          width: currentWidth,
          height: newHeight
        });
      } else {
        // Extend from top (adjust y position to maintain bottom position)
        const newY = currentY - (newHeight - oldHeight);
        this.window.setBounds({
          x: currentX,
          y: newY,
          width: currentWidth,
          height: newHeight
        });
      }

      // Check if animation should continue
      const isMoving = Math.abs(this.velocity) > this.config.precision;
      const isAtTarget = Math.abs(displacement) > this.config.precision;

      if (isMoving || isAtTarget) {
        this.animationFrameId = setTimeout(update, 1000 / 60);
      } else {
        // Final position adjustment
        const finalY = distanceToTop < distanceToBottom ? currentY : currentY - (this.targetHeight - oldHeight);

        this.window.setBounds({
          x: currentX,
          y: finalY,
          width: currentWidth,
          height: Math.round(this.targetHeight)
        });

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
