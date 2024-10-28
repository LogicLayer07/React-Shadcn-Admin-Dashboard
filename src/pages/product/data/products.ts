function generateRandomProducts(count : any) {
  const categories = ["Tops", "Bottoms", "Shoes", "Accessories"];
  const brands = ["ComfortWear", "StylePro", "ActiveFit", "UrbanTrend"];
  const colors = ["White", "Black", "Blue", "Red", "Green"];
  const sizes = ["S", "M", "L", "XL"];
  const materialOptions = ["100% Cotton", "Polyester Blend", "Wool", "Silk"];
  const careInstructionsOptions = [
    ["Machine wash cold", "Tumble dry low"],
    ["Hand wash", "Dry clean only"],
    ["Do not bleach", "Iron on low heat"]
  ];
  const featuresOptions = [
    ["Breathable fabric", "Ribbed crew neck", "Short sleeves"],
    ["Water-resistant", "Stretch fabric", "Zipper closure"],
    ["Slim fit", "Quick-dry", "Reflective details"]
  ];
  
  const generateRandomNumber = (min : any, max : any) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomElement = (arr : any) => arr[generateRandomNumber(0, arr.length - 1)];

  const products = [];

  for (let i = 1; i <= count; i++) {
    const randomName = `Product ${i}`;
    const randomCategory = getRandomElement(categories);
    const randomBrand = getRandomElement(brands);
    const randomMaterial = getRandomElement(materialOptions);
    const randomCareInstructions = getRandomElement(careInstructionsOptions);
    const randomFeatures = getRandomElement(featuresOptions);

    const variants = sizes.map(size => ({
      size,
      colors: colors.map(color => ({
        color,
        price: parseFloat((generateRandomNumber(15, 30) + Math.random()).toFixed(2)),
        originalPrice: parseFloat((generateRandomNumber(25, 50) + Math.random()).toFixed(2)),
        stockStatus: ["In Stock", "Out of Stock", "Low Stock"][generateRandomNumber(0, 2)]
      }))
    }));

    const promotion = {
      offer: "Buy 2, Get 1 Free",
      discountPercentage: generateRandomNumber(10, 30)
    };

    products.push({
      id: i,
      general: {
        name: randomName,
        description: "A versatile and stylish product for everyday use.",
        brand: randomBrand,
        category: randomCategory,
      },
      details: {
        material: randomMaterial,
        careInstructions: randomCareInstructions,
        features: randomFeatures,
      },
      variants,
      promotion
    });
  }

  return products;
}

export const products = generateRandomProducts(100);

// export const products = [
//   {
//     id: 1,
//     general: {
//       name: "Classic T-Shirt",
//       description: "A comfortable and versatile t-shirt for everyday wear.",
//       brand: "ComfortWear",
//       category: "Tops",
//     },
//     details: {
//       material: "100% Cotton",
//       careInstructions: ["Machine wash cold", "Tumble dry low"],
//       features: ["Breathable fabric", "Ribbed crew neck", "Short sleeves"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "Out of Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "White", price: 21.99, originalPrice: 26.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 21.99, originalPrice: 26.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Buy 2, Get 1 Free",
//       discountPercentage: 20,
//     },
//   },
//   {
//     id: 2,
//     general: {
//       name: "Athletic Joggers",
//       description: "Lightweight joggers designed for comfort during workouts.",
//       brand: "Sportify",
//       category: "Bottoms",
//     },
//     details: {
//       material: "Polyester and Spandex blend",
//       careInstructions: ["Machine wash cold", "Do not bleach", "Hang dry"],
//       features: ["Stretch fabric", "Elastic waistband", "Zipper pockets"],
//     },
//     variants: [
//       {
//         size: "M",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "Low Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "Out of Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "XL",
//         colors: [
//           { color: "Gray", price: 32.99, originalPrice: 37.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 32.99, originalPrice: 37.99, stockStatus: "Low Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "10% off for members",
//       discountPercentage: 10,
//     },
//   },
//   {
//     id: 3,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 4,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 1,
//     general: {
//       name: "Classic T-Shirt",
//       description: "A comfortable and versatile t-shirt for everyday wear.",
//       brand: "ComfortWear",
//       category: "Tops",
//     },
//     details: {
//       material: "100% Cotton",
//       careInstructions: ["Machine wash cold", "Tumble dry low"],
//       features: ["Breathable fabric", "Ribbed crew neck", "Short sleeves"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "Out of Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "White", price: 21.99, originalPrice: 26.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 21.99, originalPrice: 26.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Buy 2, Get 1 Free",
//       discountPercentage: 20,
//     },
//   },
//   {
//     id: 2,
//     general: {
//       name: "Athletic Joggers",
//       description: "Lightweight joggers designed for comfort during workouts.",
//       brand: "Sportify",
//       category: "Bottoms",
//     },
//     details: {
//       material: "Polyester and Spandex blend",
//       careInstructions: ["Machine wash cold", "Do not bleach", "Hang dry"],
//       features: ["Stretch fabric", "Elastic waistband", "Zipper pockets"],
//     },
//     variants: [
//       {
//         size: "M",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "Low Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "Out of Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "XL",
//         colors: [
//           { color: "Gray", price: 32.99, originalPrice: 37.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 32.99, originalPrice: 37.99, stockStatus: "Low Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "10% off for members",
//       discountPercentage: 10,
//     },
//   },
//   {
//     id: 3,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 4,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 1,
//     general: {
//       name: "Classic T-Shirt",
//       description: "A comfortable and versatile t-shirt for everyday wear.",
//       brand: "ComfortWear",
//       category: "Tops",
//     },
//     details: {
//       material: "100% Cotton",
//       careInstructions: ["Machine wash cold", "Tumble dry low"],
//       features: ["Breathable fabric", "Ribbed crew neck", "Short sleeves"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "Out of Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "White", price: 21.99, originalPrice: 26.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 21.99, originalPrice: 26.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Buy 2, Get 1 Free",
//       discountPercentage: 20,
//     },
//   },
//   {
//     id: 2,
//     general: {
//       name: "Athletic Joggers",
//       description: "Lightweight joggers designed for comfort during workouts.",
//       brand: "Sportify",
//       category: "Bottoms",
//     },
//     details: {
//       material: "Polyester and Spandex blend",
//       careInstructions: ["Machine wash cold", "Do not bleach", "Hang dry"],
//       features: ["Stretch fabric", "Elastic waistband", "Zipper pockets"],
//     },
//     variants: [
//       {
//         size: "M",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "Low Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "Out of Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "XL",
//         colors: [
//           { color: "Gray", price: 32.99, originalPrice: 37.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 32.99, originalPrice: 37.99, stockStatus: "Low Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "10% off for members",
//       discountPercentage: 10,
//     },
//   },
//   {
//     id: 3,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 4,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 1,
//     general: {
//       name: "Classic T-Shirt",
//       description: "A comfortable and versatile t-shirt for everyday wear.",
//       brand: "ComfortWear",
//       category: "Tops",
//     },
//     details: {
//       material: "100% Cotton",
//       careInstructions: ["Machine wash cold", "Tumble dry low"],
//       features: ["Breathable fabric", "Ribbed crew neck", "Short sleeves"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "White", price: 19.99, originalPrice: 24.99, stockStatus: "In Stock" },
//           { color: "Black", price: 19.99, originalPrice: 24.99, stockStatus: "Out of Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "White", price: 21.99, originalPrice: 26.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 21.99, originalPrice: 26.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Buy 2, Get 1 Free",
//       discountPercentage: 20,
//     },
//   },
//   {
//     id: 2,
//     general: {
//       name: "Athletic Joggers",
//       description: "Lightweight joggers designed for comfort during workouts.",
//       brand: "Sportify",
//       category: "Bottoms",
//     },
//     details: {
//       material: "Polyester and Spandex blend",
//       careInstructions: ["Machine wash cold", "Do not bleach", "Hang dry"],
//       features: ["Stretch fabric", "Elastic waistband", "Zipper pockets"],
//     },
//     variants: [
//       {
//         size: "M",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "Low Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Gray", price: 29.99, originalPrice: 34.99, stockStatus: "Out of Stock" },
//           { color: "Navy", price: 29.99, originalPrice: 34.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "XL",
//         colors: [
//           { color: "Gray", price: 32.99, originalPrice: 37.99, stockStatus: "In Stock" },
//           { color: "Navy", price: 32.99, originalPrice: 37.99, stockStatus: "Low Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "10% off for members",
//       discountPercentage: 10,
//     },
//   },
//   {
//     id: 3,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
//   {
//     id: 4,
//     general: {
//       name: "Waterproof Jacket",
//       description: "Durable and lightweight jacket to keep you dry in rainy weather.",
//       brand: "OutdoorPro",
//       category: "Outerwear",
//     },
//     details: {
//       material: "Nylon with waterproof coating",
//       careInstructions: ["Hand wash", "Do not tumble dry", "Do not iron"],
//       features: ["Adjustable hood", "Waterproof zippers", "Breathable fabric"],
//     },
//     variants: [
//       {
//         size: "S",
//         colors: [
//           { color: "Red", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//           { color: "Black", price: 49.99, originalPrice: 59.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "M",
//         colors: [
//           { color: "Red", price: 51.99, originalPrice: 64.99, stockStatus: "Low Stock" },
//           { color: "Black", price: 51.99, originalPrice: 64.99, stockStatus: "In Stock" },
//         ],
//       },
//       {
//         size: "L",
//         colors: [
//           { color: "Red", price: 53.99, originalPrice: 66.99, stockStatus: "Out of Stock" },
//           { color: "Black", price: 53.99, originalPrice: 66.99, stockStatus: "In Stock" },
//         ],
//       },
//     ],
//     promotion: {
//       offer: "Free shipping on orders over $50",
//       discountPercentage: 15,
//     },
//   },
// ]
