import { FunstartEnPage } from './app.po';

describe('funstart-en App', function() {
  let page: FunstartEnPage;

  beforeEach(() => {
    page = new FunstartEnPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
