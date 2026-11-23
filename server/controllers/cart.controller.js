import { prisma } from "../config/prisma.js";
import { subject } from "@casl/ability";
import { defineAbility } from "../middleware/ability.js";

export const getCarts = async (req, res, next) => {
  try {
    const ability = defineAbility(req.user);

    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id,
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
    if (!cart) {
      return res.status(404).json({ success: false, msg: "no cart found" });
    }
    if (!ability.can("read", subject("cart", cart))) {
      return res
        .status(403)
        .json({ success: false, msg: "yohave not allowed to read this cart" });
    }
    if (cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "Your shopping cart is currently empty",
        items: [],
      });
    }
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server error: could not fetch carts",
      error: error.message,
    });
  }
};
export const createCarts = async (req, res, next) => {
  const quantity = parseInt(req.body.quantity, 10) || 0;
  const productId = parseInt(req.body.productId, 10);
  if (isNaN(quantity) || isNaN(productId) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Valid Product ID & positive quantity required",
    });
  }
  const ability = defineAbility(req.user);
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return res.status(404).json({ success: false, msg: "product not found" });
    }
    if (product.stockQuantity < quantity) {
      return res
        .status(404)
        .json({ success: false, msg: "Product is out of stock" });
    }
    let userCart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id,
        status: "ACTIVE",
      },
    });

    const checkCartObject = userCart || {
      userId: req.user.id,
      status: "ACTIVE",
    };
    if (!ability.can("create", subject("cart", checkCartObject))) {
      return res.status(403).json({
        success: false,
        msg: "yohave not allowed to create this cart",
      });
    }
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          userId: req.user.id,
          status: "ACTIVE",
        },
      });
    }

    let cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: productId,
      },
    });
    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stockQuantity) {
        return res
          .status(404)
          .json({ success: false, msg: "Product is out of stock" });
      }
      cartItem = await prisma.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else if (!cartItem) {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }
    return res
      .status(201)
      .json({ success: true, msg: "success fully created cart", cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch carts",
      error: error.message,
    });
  }
};
export const updateCarts = async (req, res, next) => {
  const quantity = parseInt(req.body.quantity, 10) || 0;
  const itemId = parseInt(req.params.itemId, 10);
  if (isNaN(quantity) || isNaN(itemId) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Valid Product ID & positive quantity required",
    });
  }
  const ability = defineAbility(req.user);

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, msg: "Cart item not found" });
    }

    if (!ability.can("update", subject("cart", cartItem.cart))) {
      return res.status(403).json({
        success: false,
        msg: "yohave not allowed to update this cart",
      });
    }
    if (quantity > cartItem.product.stockQuantity) {
      return res.status(400).json({
        success: false,
        msg: `Requested quantity exceeds available catalog stock limit of ${cartItem.product.stockQuantity}`,
      });
    }
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: quantity,
      },
    });

    return res.status(200).json({ success: true, updatedItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch carts",
      error: error.message,
    });
  }
};
export const deleteCarts = async (req, res, next) => {
  const itemId = parseInt(req.params.itemId, 10);
  if (isNaN(itemId)) {
    return res.status(404).json({ success: false, msg: "Item ID is required" });
  }
  const ability = defineAbility(req.user);

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, msg: "Cart item not found" });
    }

    if (!ability.can("delete", subject("cart", cartItem.cart))) {
      return res.status(403).json({
        success: false,
        msg: "yohave not allowed to update this cart",
      });
    }

    const deletedItem = await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Product removed successfully",
      deletedItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "servr error: could not fetch carts",
      error: error.message,
    });
  }
};
