describe('getColor', function() {
	var colorResult = "white";

	it('Should return white for 1', function() {
        expect(getColor(1)).toBe(colorResult);
    });

	it('Should return white for invalid string value', function() {
        expect(getColor("hello")).toBe(colorResult);
    });

	it('Should return white for invalid integer value', function() {
        expect(getColor(-1)).toBe(colorResult);
    });

	colorResult = "green";
	it('Should return green for 2', function() {
        expect(getColor(2)).toBe(colorResult);
    });
});

describe('getShape', function() {
	var shapeResult = "fa-circle";

    it('Should return fa-circle for 1', function() {
        expect(getShape(1)).toBe(shapeResult);
    });

	it('Should return fa-circle for invalid string value', function() {
        expect(getShape("hello")).toBe(shapeResult);
    });

	it('Should return fa-circle for invalid integer value', function() {
        expect(getShape(-1)).toBe(shapeResult);
    });

	shapeResult = "fa-stop";
	it('Should return fa-stop for 2', function() {
        expect(getShape(2)).toBe(shapeResult);
    });
});
