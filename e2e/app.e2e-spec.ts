import { BallsPage } from './app.po';

describe('balls App', () => {
  let page: BallsPage;

  beforeEach(() => {
    page = new BallsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
