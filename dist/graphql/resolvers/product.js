var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Product } = require('../../models');
module.exports = {
    products: ({ search }) => __awaiter(this, void 0, void 0, function* () {
        let products = [];
        try {
            if (search) {
                console.log(search);
                products = yield Product.find({
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                });
            }
            else {
                products = yield Product.find();
            }
            return products.map(product => (Object.assign({}, product._doc)));
        }
        catch (error) {
            throw err;
        }
    }),
    createProduct: ({ productData }, request) => __awaiter(this, void 0, void 0, function* () {
        if (!request.isAuth) {
            throw new Error("Unauthenticated. Please log in.");
        }
        const newProduct = yield Product.create(Object.assign({}, productData));
        return Object.assign({}, newProduct._doc);
    })
};
//# sourceMappingURL=product.js.map