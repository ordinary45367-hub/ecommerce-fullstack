import { prisma } from "../config/prisma.js";
import { subject } from "@casl/ability";
import { defineAbility } from "../middleware/ability.js";
import { productSchema } from "../config/zod.schema.js";

// GET /api/products	Get all products
export const getProducts = async (req, res, next) => {
  const { category, name } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: category,
        },
        name: name
          ? {
              contains: name.trim(),
            }
          : undefined,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        description: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
        stockQuantity: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (products.length === 0) {
      return res.status(200).json({
        success: false,
        msg: "there is no product in database",
        products: [],
      });
    }
    return res
      .status(200)
      .json({ success: true, count: products.length, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch products",
      error: error.message,
    });
  }
};
//GET /api/products/:id	Get one product
export const getProductsById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          images: {
            select: {
              imageUrl: true,
            },
          },
          stockQuantity: true,
        },
      },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, msg: "product not found " });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch product",
      error: error.message,
    });
  }
};
//POST /api/products	Create a new product Auth
export const createProducts = async (req, res, next) => {
  const { name, price, categoryId, quantity, description } = req.body;
  const ability = defineAbility(req.user);

  try {
    if (!ability.can("create", "product")) {
      return res.status(403).json({
        success: false,
        msg: "you have not allowed to create a product",
      });
    }
    if (!name || !categoryId || !price) {
      return res.status(400).json({
        success: false,
        msg: "all field required",
      });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        stockQuantity: parseInt(quantity),
        description,
      },
    });
    if (!product) {
      return res.status(404).json({ success: false, msg: "cannot created." });
    }
    return res
      .status(201)
      .json({ success: true, msg: "successfully product created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch product",
      error: error.message,
    });
  }
};
//PATCH /api/products/:id	   Update a product
export const updateProducts = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid product ID",
    });
  }
  const ability = defineAbility(req.user);
  if (!ability.can("update", "product")) {
    return res.status(403).json({
      success: false,
      msg: "you have not allowed to create a product",
    });
  }
  const result = productSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: result.data,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, msg: "cannot updated. product not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "successfully product updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch product",
      error: error.message,
    });
  }
};
//DELETE /api/products/:id	Delete a product
export const deleteProducts = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid product ID",
    });
  }
  const ability = defineAbility(req.user);
  if (!ability.can("delete", "product")) {
    return res.status(403).json({
      success: false,
      msg: "you have not allowed to create a product",
    });
  }
  try {
    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.status(404).json({ success: false, msg: "cannot deleted." });
    }
    return res
      .status(200)
      .json({ success: true, msg: "successfully product deleted" });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({
        success: false,
        msg: "Cannot delete product because it is part of existing orders",
      });
    }
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch product",
      error: error.message,
    });
  }
};
