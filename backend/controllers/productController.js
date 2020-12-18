import Product from "../models/productModel.js";
import AsyncHandler from "express-async-handler";

/**
 * @description Fetch all products
 * @route       GET /api/products
 * @access      Public
 */
const getProducts = AsyncHandler(async (req, res) => {
	const products = await Product.find({});
	res.json(products);
});

/**
 * @description Fetch single products
 * @route       GET /api/products/:id
 * @access      Public
 */
const getProductById = AsyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

/**
 * @description Delete a product
 * @route       DELETE /api/products/:id
 * @access      Private/Admin
 */
const deleteProduct = AsyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		product.remove();
		res.json({
			message: "Product successfully deleted",
		});
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

/**
 * @description Create a product
 * @route       POST /api/products
 * @access      Private/Admin
 */
const createProduct = AsyncHandler(async (req, res) => {
	const product = new Product({
		name: "Sample name",
		price: 0,
		user: req.user._id,
		image: "/images/sample.jpg",
		brand: "Sample brand",
		category: "Sample category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample description",
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

/**
 * @description Update a product
 * @route       PUT /api/products/:id
 * @access      Private/Admin
 */
const updateProduct = AsyncHandler(async (req, res) => {
	const {
		name,
		price,
		image,
		brand,
		category,
		description,
		countInStock,
	} = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.image = image;
		product.description = description;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
	} else {
		res.status(404);
		throw new Error("Product not found");
	}

	const updatedProduct = await product.save();
	res.status(201).json(updatedProduct);
});

export {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
};
