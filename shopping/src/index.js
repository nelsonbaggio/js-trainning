const { products } = require('./data/products.json');

const target = [120, 230, 310, 490];
//const target = [130, 140, 230, 260]
//const target = [110, 120, 130, 140]
//const target = [110, 130, 140, 230, 310, 330]

const getProductsByIds = (ids, products) => {
    return products.filter(product => ids.indexOf(product.id) !== -1);
}

const getProductsCategories = products => products.map(({ category }) => category);

const getCategoryQuantity = allCategories => new Set(allCategories).size;

const getRegularPrices = products =>
    products.reduce((acc, product) => acc += product.regularPrice, 0);

const getPromotionPrices = (products, currentPromotion) => {
    return products.reduce((acc, product) => {
        let promotionValue = 0;
        product.promotions.map(promotion => {
            if (promotion.looks.includes(currentPromotion)) {
                promotionValue = promotion.price
            }
        })
        return acc += promotionValue || product.regularPrice;
    }, 0);
}

const getPromotion = quantity => {
    const promotions = {
        1: 'SINGLE LOOK',
        2: 'DOUBLE LOOK',
        3: 'TRIPLE LOOK',
        4: 'FULL LOOK',
    }
    return promotions[quantity];
}

parseProducts = products => {
    return products.map(({ name, category }) => {
        return { name, category };
    })
};

const round = (value) => Math.round(value * 100) / 100;

const formatPercentage = (discount, total) =>
    `${Math.round(((discount / total) * 100) * 100) / 100}%`;

const getShoppingCart = (ids, allProducts) => {
    const shoppingProducts = getProductsByIds(ids, allProducts);
    const categories = getProductsCategories(shoppingProducts);
    const shoppingCategories = getCategoryQuantity(categories);
    const promotion = getPromotion(shoppingCategories);
    const totalPrice = round(getRegularPrices(shoppingProducts));
    const discountValue = round(totalPrice - getPromotionPrices(shoppingProducts, promotion));
    const discountPercentage = formatPercentage(discountValue, totalPrice);
    const products = parseProducts(shoppingProducts);
    return {
        products,
        promotion,
        totalPrice,
        discountValue,
        discountPercentage,
    }
}

module.exports = {
    getCategoryQuantity,
    getProductsByIds,
    getProductsCategories,
    getPromotionPrices,
    getRegularPrices,
    getShoppingCart
}
