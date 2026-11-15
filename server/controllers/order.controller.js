import { subject } from "@casl/ability";
import { defineAbility } from "../middleware/ability.js";
import { prisma } from "../config/prisma.js";
export const getAllOrder = async (req, res, next) => {
  const ability = defineAbility(req.user);
  if (!ability.can("manage", "all")) {
    return res.status(403).json({
      success: false,
      msg: "Access denied. Admins only.",
    });
  }
  try {
    const order = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!order || order.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "you have no order please first order",
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server error: could not fetch orders",
      error: error.message,
    });
  }
};
export const getMyorder = async (req, res, next) => {
  const ability = defineAbility(req.user);
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!order || order.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "you have no order please first order",
      });
    }
    for (const oneOrder of order) {
      if (!ability.can("read", subject("order", oneOrder))) {
        return res.status(403).json({
          success: false,
          msg: "you have not allowed to read this order",
        });
      }
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server error: could not fetch orders",
      error: error.message,
    });
  }
};
export const createOrder = async (req, res, next) => {
  const ability = defineAbility(req.user);

  try {
    if (!ability.can("create", "order")) {
      return res
        .status(403)
        .json({ success: false, msg: "you are not allowed to read this cart" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: {
          userId: req.user.id,
          status: "ACTIVE",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!cart || cart.items.length === 0) {
        throw new Error("No active cart or cart is empty");
      }
      const CartItem = cart?.items;
      const rawTotal = CartItem.reduce((acc, item) => {
        return acc + Number(item.product.price) * item.quantity;
      }, 0);

      const totalPrice = Number(rawTotal.toFixed(2));
      if (totalPrice <= 0) {
        throw new Error("Invalid order total amount");
      }
      const order = await tx.order.create({
        data: { userId: req.user.id, totalAmount: totalPrice },
      });

      for (const item of CartItem) {
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: {
              gte: item.quantity,
            },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
        if (updatedProduct.count === 0) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          },
        });
      }

      const updatedCart = await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          status: "CLOSED",
        },
      });
      return order;
    });

    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server error: could not fetch orders",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const status = req.params.status;

  const ability = defineAbility(req.user);
  try {
    if (!ability.can("update", subject("order"))) {
      return res.status(403).json({
        success: false,
        msg: "You are not allowed to update this order",
      });
    }
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "you have no order. please order first before trying to update order",
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server error: could not update orders",
      error: error.message,
    });
  }
};
