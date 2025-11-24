"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = require("../config/database");
const drizzle_orm_1 = require("drizzle-orm");
class ProductService {
    static async createProduct(productData) {
        const { name, description, price, category, imageUrl, isAvailable = true } = productData;
        const newProduct = {
            name,
            description,
            price: price.toString(),
            category,
            imageUrl,
            isAvailable,
        };
        const [createdProduct] = await database_1.db
            .insert(database_1.schema.products)
            .values(newProduct)
            .returning();
        return {
            ...createdProduct,
            price: parseFloat(createdProduct.price),
        };
    }
    static async getAllProducts(options = {}) {
        const { page = 1, limit = 10, category, search, availableOnly = false, sortBy = 'createdAt', sortOrder = 'desc', } = options;
        // Build query conditions
        const conditions = [];
        if (availableOnly) {
            conditions.push((0, drizzle_orm_1.eq)(database_1.schema.products.isAvailable, true));
        }
        if (category) {
            conditions.push((0, drizzle_orm_1.eq)(database_1.schema.products.category, category));
        }
        if (search) {
            conditions.push((0, drizzle_orm_1.ilike)(database_1.schema.products.name, `%${search}%`));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        // Build order by clause
        let orderBy;
        switch (sortBy) {
            case 'name':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.products.name) : (0, drizzle_orm_1.desc)(database_1.schema.products.name);
                break;
            case 'price':
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.products.price) : (0, drizzle_orm_1.desc)(database_1.schema.products.price);
                break;
            case 'createdAt':
            default:
                orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(database_1.schema.products.createdAt) : (0, drizzle_orm_1.desc)(database_1.schema.products.createdAt);
                break;
        }
        // Get total count
        const countResult = await database_1.db
            .select({ count: database_1.schema.products.id })
            .from(database_1.schema.products)
            .where(whereClause);
        const total = countResult.length;
        // Get products with pagination
        const offset = (page - 1) * limit;
        const products = await database_1.db
            .select()
            .from(database_1.schema.products)
            .where(whereClause)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);
        // Convert price from string to number
        const formattedProducts = products.map(product => ({
            ...product,
            price: parseFloat(product.price),
        }));
        return {
            products: formattedProducts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getProductById(id) {
        const [product] = await database_1.db
            .select()
            .from(database_1.schema.products)
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, id))
            .limit(1);
        if (!product) {
            return null;
        }
        return {
            ...product,
            price: parseFloat(product.price),
        };
    }
    static async updateProduct(id, updates) {
        const { price, ...otherUpdates } = updates;
        const updateData = {
            ...otherUpdates,
            updatedAt: new Date(),
        };
        if (price !== undefined) {
            updateData.price = price.toString();
        }
        const [updatedProduct] = await database_1.db
            .update(database_1.schema.products)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, id))
            .returning();
        if (!updatedProduct) {
            return null;
        }
        return {
            ...updatedProduct,
            price: parseFloat(updatedProduct.price),
        };
    }
    static async deleteProduct(id) {
        const [deletedProduct] = await database_1.db
            .delete(database_1.schema.products)
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, id))
            .returning({ id: database_1.schema.products.id });
        return !!deletedProduct;
    }
    static async getCategories() {
        const result = await database_1.db
            .selectDistinct({ category: database_1.schema.products.category })
            .from(database_1.schema.products)
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.isAvailable, true));
        return result.map(row => row.category);
    }
    static async toggleProductAvailability(id) {
        const [product] = await database_1.db
            .select({ isAvailable: database_1.schema.products.isAvailable })
            .from(database_1.schema.products)
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, id))
            .limit(1);
        if (!product) {
            return null;
        }
        const [updatedProduct] = await database_1.db
            .update(database_1.schema.products)
            .set({
            isAvailable: !product.isAvailable,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(database_1.schema.products.id, id))
            .returning();
        return {
            ...updatedProduct,
            price: parseFloat(updatedProduct.price),
        };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=productService.js.map