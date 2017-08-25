import { TestBed, async } from '@angular/core/testing';
import { RoundPipe } from './round.pipe';

describe('Pipe: RoundPipe', () => {
  let pipe: RoundPipe;

  beforeEach(() => {
    pipe = new RoundPipe();
  });

  it('1.5 -> 2', () => {
	  expect(pipe.transform(1.5)).toBe(2);
  });

  it('1.49 -> 1', () => {
    expect(pipe.transform(1.4999999)).toBe(1);
  });

  it('-1.51 -> -2', () => {
    expect(pipe.transform(-1.51)).toBe(-2);
  });

  it('-1.5 -> -1', () => {
    expect(pipe.transform(-1.5)).toBe(-1);
  });
});
