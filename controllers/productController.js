import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"
import { isDemoMode } from "../configs/runtime.js"
import { createDemoId, demoProducts } from "../data/demoStore.js"
//Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        if (isDemoMode) {
            const image = images?.length
                ? ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"]
                : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"];
            demoProducts.unshift({ ...productData, _id: createDemoId("product"), image, inStock: true });
            return res.json({ success: true, message: "Product added" })
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    { resource_type: 'image' });
                return result.secure_url
            })
        )

        await Product.create({ ...productData, image: imagesUrl })
        res.json({ success: true, message: "Product added" })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//get Product : /api/product/list/id
export const productList = async (req, res) => {
    try {
        if (isDemoMode) {
            return res.json({ success: true, products: demoProducts })
        }

        const products = await Product.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


//get single  Product : /api/product/list
export const productById = async (req, res) => {
    try {
        const id = req.body.id || req.query.id
        if (isDemoMode) {
            const product = demoProducts.find((item) => item._id === id)
            return res.json({ success: true, product })
        }
        const product = await Product.findById(id)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}




//Change product in stock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body
        if (isDemoMode) {
            const product = demoProducts.find((item) => item._id === id)
            if (product) product.inStock = inStock
            return res.json({ success: true, message: "Stock updated" })
        }

        await Product.findByIdAndUpdate(id, { inStock })
        //Doubt
        res.json({ success: true, message: "Stock updated" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
