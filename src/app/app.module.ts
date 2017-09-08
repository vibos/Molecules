// Production build:
// ng build --base-href https://vibos.github.io/molecules/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Components
import { AppComponent } from './app.component';
import { BallsGeneratorComponent } from './balls-generator/balls-generator.component';
import { CanvasComponent } from './canvas/canvas.component';

// Pipes
import { RoundPipe } from './_pipes/round.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BallsGeneratorComponent,
    CanvasComponent,
    RoundPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
