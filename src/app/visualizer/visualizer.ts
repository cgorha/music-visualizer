import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

declare var p5: any;
@Component({
  selector: 'app-visualizer',
  imports: [],
  templateUrl: './visualizer.html',
  styleUrl: './visualizer.scss'
})
export class Visualizer implements OnInit, OnDestroy{
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private p5Instance!: any;

  ngOnInit(): void {
    this.createSketch();
  }

  ngOnDestroy(): void {
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  }

  private createSketch(): void {
    const sketch = (s: any) => {
      let mic: any;
      let amplitude: any;
      let micReady = false;

      s.setup = () => {
        s.createCanvas(window.innerWidth, window.innerHeight).parent(this.canvasRef.nativeElement);
        s.angleMode(s.DEGREES);
        s.userStartAudio().then(() => {
          mic = new p5.AudioIn();
          mic.start();

          amplitude = new p5.Amplitude();

          const micCheckInterval = setInterval(() => {
            const level = mic.getLevel();
            if (level > 0) {
              amplitude.setInput(mic);
              micReady = true;
              clearInterval(micCheckInterval);
            }
          }, 100);
        });
      };

      s.draw = () => {
        s.background(10, 10, 25, 100);
        s.stroke(180, 255, 255);
        s.noFill();
        s.translate(s.width / 2, s.height);

        if (micReady && amplitude) {
          const level = amplitude.getLevel();
          const length = s.map(level, 0, 0.3, 60, 180);
          const angle = s.map(level, 0, 0.3, 10, 35);

          drawFractal(length, angle, 0);
        } else {
          s.fill(255);
          s.textAlign(s.CENTER, s.CENTER);
          s.text('Waiting for mic...', s.width / 2, s.height / 2);
        }
      };

      const drawFractal = (len: number, angle: number, depth: number) => {
        if (len < 4 || depth > 10) return;

        s.strokeWeight(s.map(len, 0, 150, 0.5, 3));
        s.line(0, 0, 0, -len);
        s.translate(0, -len);

        s.push();
        s.rotate(angle);
        drawFractal(len * 0.67, angle, depth + 1);
        s.pop();

        s.push();
        s.rotate(-angle);
        drawFractal(len * 0.67, angle, depth + 1);
        s.pop();
      };

      s.windowResized = () => {
        s.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    this.p5Instance = new p5(sketch);
  }
}
