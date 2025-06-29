import { Component } from '@angular/core';
import { Visualizer } from "./visualizer/visualizer";

@Component({
  selector: 'app-root',
  imports: [Visualizer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'music-visualizer';
}
