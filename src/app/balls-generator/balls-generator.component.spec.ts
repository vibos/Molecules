import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallsGeneratorComponent } from './balls-generator.component';

describe('BallsGeneratorComponent', () => {
  let component: BallsGeneratorComponent;
  let fixture: ComponentFixture<BallsGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallsGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
