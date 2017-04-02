describe('price calculator', function(){
	
	it('should calc price right', function(){
		var userType = 0;
		var productType = 0;
		var price = 1;
		var publishedDate = new Date();

		var expected = 16;
		var actual = calculatePrice(userType, productType, price, publishedDate);
		expect(expected).to.equal(actual);
	});

});