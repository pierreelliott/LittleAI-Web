describe('getColor', function() {
    var colorNumber = 1;
	var colorResult = "white";

    it('Should be white', function() {
        expect(getColor(colorNumber)).toBe(colorResult);
    });
});
