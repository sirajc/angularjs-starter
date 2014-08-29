'use strict';

describe('Kokan Trust App', function() {
  it('should redirect index.html to index.html#/home', function() {
      browser.get('index.html');
      browser.getLocationAbsUrl().then(function(url) {
          expect(url.split('#')[1]).toBe('/home');
      });
  });
});
