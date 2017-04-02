describe('price calculator (refactored)', function () {

	it('should calc price right', function () {
		expect(PriceCalculator.calc({
			userType: PriceCalculator.userTypes.company,
			productType: PriceCalculator.productTypes.newProduct,
			price: 1,
			publishedDate: new Date()
		})).to.equal(11);
	});

	it('wrong input price', function () {
		expect(PriceCalculator.calc.bind(null, {
			userType: PriceCalculator.userTypes.company,
			productType: PriceCalculator.productTypes.newProduct,
			price: -1,
			publishedDate: new Date()
		})).to.throwException(Error);
	});

	describe('rules: ', function () {

		describe('endDateDiscount: ', function () {

			it('enddate discount', function () {
				expect(PriceCalculator.rules.endDateDiscount({
					publishedDate: new Date()
				})).to.equal(PriceCalculator.END_DATE_DISCOUNT);
			});

			it('no enddate discount', function () {
				expect(PriceCalculator.rules.endDateDiscount({
					publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 24)
				})).to.equal(0);
			});

			it('wrong publishedDate', function () {
				expect(PriceCalculator.rules.endDateDiscount.bind(null, {}))
					.to.throwException(Error);
			});

		});

		describe('companyDiscount: ', function () {

			it('company discount', function () {
				expect(PriceCalculator.rules.companyDiscount({
					userType: PriceCalculator.userTypes.company
				})).to.equal(PriceCalculator.COMPANY_DISCOUNT);
			});

			it('normal discount', function () {
				expect(PriceCalculator.rules.companyDiscount({
					userType: PriceCalculator.userTypes.normal
				})).to.equal(PriceCalculator.NORMAL_DISCOUNT);
			});

			it('unknow userType', function () {
				expect(PriceCalculator.rules.companyDiscount.bind(null, {
					userType: -1
				})).to.throwException(Error);
			});

		});

		describe('addPrice: ', function () {

			it('new product', function () {
				expect(PriceCalculator.rules.addPrice({
					productType: PriceCalculator.productTypes.newProduct
				})).to.equal(PriceCalculator.ADD_PRICE_NEW);
			});

			it('old product', function () {
				expect(PriceCalculator.rules.addPrice({
					productType: PriceCalculator.productTypes.oldProduct
				})).to.equal(PriceCalculator.ADD_PRICE_OLD);
			});

			it('unknow productType', function () {
				expect(PriceCalculator.rules.addPrice.bind(null, {
					productType: -1
				})).to.throwException(Error);
			});

		});

	});

});