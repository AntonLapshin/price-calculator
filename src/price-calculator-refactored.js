'use strict';

/**
 * Calculates the product price
 * Supports AMD, CommonJS, Global modules
 * ES5
 */
; (function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["PriceCalculator"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("PriceCalculator"));
  } else {
    root.PriceCalculator = factory(root);
  }
}(this, function (root) {

  /**
   * Predefined enums
   */
  var userTypes = {
    normal: 0,
    company: 1
  };

  var productTypes = {
    newProduct: 0,
    oldProduct: 1
  };

  /**
   * Constants
   * Should be stored in a database or any other manageble source
   */
  var END_DATE_DISCOUNT = 10;
  var COMPANY_DISCOUNT = 5;
  var NORMAL_DISCOUNT = 0;
  var ADD_PRICE_NEW = 25;
  var ADD_PRICE_OLD = 35;

  function PriceCalcException(params, e) {
    this.params = params;
    this.originalException = e;
    this.message = 'Price Calc Exception'
    this.toString = function () {
      return this.message + ' '
        + JSON.stringify(this.params) + ' '
        + this.originalException.toString();
    };
  }

  /**
   * Price calculation rules. Interface (params) => price amount
   * 
   * @param {object} params Map of the input parameters
   * @returns {number} price amount
   */
  function endDateDiscount(params) {
    return params.publishedDate.toDateString() === new Date().toDateString()
      ? END_DATE_DISCOUNT
      : 0;
  }

  function companyDiscount(params) {
    switch (params.userType) {
      case userTypes.company:
        return COMPANY_DISCOUNT;
      case userTypes.normal:
        return NORMAL_DISCOUNT;
      default:
        throw 'Unknow userType';
    }
  }

  function addPrice(params) {
    switch (params.productType) {
      case productTypes.newProduct:
        return ADD_PRICE_NEW;
      case productTypes.oldProduct:
        return ADD_PRICE_OLD;
      default:
        throw 'Unknow productType';
    }
  }

  /**
   * Public Interface
   */
  var PriceCalculator = Object.freeze({
    rules: Object.freeze({
      endDateDiscount: endDateDiscount,
      companyDiscount: companyDiscount,
      addPrice: addPrice
    }),
    userTypes: Object.freeze(userTypes),
    productTypes: Object.freeze(productTypes),
    END_DATE_DISCOUNT: END_DATE_DISCOUNT,
    COMPANY_DISCOUNT: COMPANY_DISCOUNT,
    NORMAL_DISCOUNT: NORMAL_DISCOUNT,
    ADD_PRICE_NEW: ADD_PRICE_NEW,
    ADD_PRICE_OLD: ADD_PRICE_OLD,
    
    /**
    * Calculates the product price
    * 
    * 1. <Object way> to pass the parameters (allows to easily extend the parameters, 
    * add or remove them without changing the signature of the method)
    * @param {Object} params Set of the input parameters
    * @param {number|UserTypes} params.userType User Type
    * @param {number|ProductTypes} params.userType Product Type
    * @param {number} params.price Product Price
    * @param {Date} params.publishedDate Product Published Date
    *
    * 2. <Plain way> to pass the parameters (backward compatibility) Remove if it's not
    * necessary anymore
    * @param {number|UserTypes} userType User Type
    * @param {number|ProductTypes} userType Product Type
    * @param {number} price Product Price
    * @param {Date} publishedDate Product Published Date
    * 
    * @returns {number} Calculated Product Price
    * @throws {PriceCalcException} Exception occured inside of the rules
    */
    calc: function (paramsOrUserType, productType, price, publishedDate) {
      var params = typeof paramsOrUserType === 'object'
        ? paramsOrUserType
        : {
          userType: paramsOrUserType,
          productType: productType,
          price: price,
          publishedDate: publishedDate
        };

      try {
        if (!(params.price > 0))
          throw 'Wrong price';

        // -----------------------
        // ---- Price formula ----
        // -----------------------
        return params.price
          + addPrice(params)
          - (endDateDiscount(params) + companyDiscount(params));
      }
      catch (e) {
        throw new PriceCalcException(params, e);
      }
    }

  });

  //
  // Backward compatibility. Remove if it's not necessary anymore
  //
  root.calculatePrice = PriceCalculator.calc;

  return PriceCalculator;

}));
