
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('http://localhost:9000');
    var dataAPI = angular.injector(['embeditor']).get('youTubeDataAPI');
    var spyglass = element(by.id('spyglass'));
    var searchbox = element(by.id('toolbar-searchbox'));
    spyOn(dataAPI, 'query');

    spyglass.click();
    expect(spyglass).not.toBeUndefined();
    expect(dataAPI.query).toHaveBeenCalled();

  });
});