import { db, schema } from '../config/database';
import { eq, ilike, and, desc, asc } from 'drizzle-orm';
import { NewProduct } from '../db/schema';

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductService {
  static async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<ProductResponse> {
    const { name, description, price, category, imageUrl, isAvailable = true } = productData;

    const newProduct: NewProduct = {
      name,
      description,
      price: price.toString(),
      category,
      imageUrl,
      isAvailable,
    };

    const [createdProduct] = await db
      .insert(schema.products)
      .values(newProduct)
      .returning();

    return {
      ...createdProduct,
      price: parseFloat(createdProduct.price),
    };
  }

  static async getAllProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    availableOnly?: boolean;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ products: ProductResponse[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      availableOnly = false,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    // Build query conditions
    const conditions = [];

    if (availableOnly) {
      conditions.push(eq(schema.products.isAvailable, true));
    }

    if (category) {
      conditions.push(eq(schema.products.category, category));
    }

    if (search) {
      conditions.push(
        ilike(schema.products.name, `%${search}%`)
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by clause
    let orderBy;
    switch (sortBy) {
      case 'name':
        orderBy = sortOrder === 'asc' ? asc(schema.products.name) : desc(schema.products.name);
        break;
      case 'price':
        orderBy = sortOrder === 'asc' ? asc(schema.products.price) : desc(schema.products.price);
        break;
      case 'createdAt':
      default:
        orderBy = sortOrder === 'asc' ? asc(schema.products.createdAt) : desc(schema.products.createdAt);
        break;
    }

    // Get total count
    const countResult = await db
      .select({ count: schema.products.id })
      .from(schema.products)
      .where(whereClause);

    const total = countResult.length;

    // Get products with pagination
    const offset = (page - 1) * limit;
    const products = await db
      .select()
      .from(schema.products)
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

  static async getProductById(id: string): Promise<ProductResponse | null> {
    const [product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .limit(1);

    if (!product) {
      return null;
    }

    return {
      ...product,
      price: parseFloat(product.price),
    };
  }

  static async updateProduct(
    id: string,
    updates: {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    }
  ): Promise<ProductResponse | null> {
    const { price, ...otherUpdates } = updates;
    const updateData: Partial<NewProduct> = {
      ...otherUpdates,
      updatedAt: new Date(),
    };

    if (price !== undefined) {
      updateData.price = price.toString();
    }

    const [updatedProduct] = await db
      .update(schema.products)
      .set(updateData)
      .where(eq(schema.products.id, id))
      .returning();

    if (!updatedProduct) {
      return null;
    }

    return {
      ...updatedProduct,
      price: parseFloat(updatedProduct.price),
    };
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const [deletedProduct] = await db
      .delete(schema.products)
      .where(eq(schema.products.id, id))
      .returning({ id: schema.products.id });

    return !!deletedProduct;
  }

  static async getCategories(): Promise<string[]> {
    const result = await db
      .selectDistinct({ category: schema.products.category })
      .from(schema.products)
      .where(eq(schema.products.isAvailable, true));

    return result.map(row => row.category);
  }

  static async toggleProductAvailability(id: string): Promise<ProductResponse | null> {
    const [product] = await db
      .select({ isAvailable: schema.products.isAvailable })
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .limit(1);

    if (!product) {
      return null;
    }

    const [updatedProduct] = await db
      .update(schema.products)
      .set({
        isAvailable: !product.isAvailable,
        updatedAt: new Date(),
      })
      .where(eq(schema.products.id, id))
      .returning();

    return {
      ...updatedProduct,
      price: parseFloat(updatedProduct.price),
    };
  }
}