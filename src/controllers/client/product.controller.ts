import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  getAllProductService,
  getProdcutById,
} from "services/client/product.service";
const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProdcutById(id);
  return res.render("client/product/detail.ejs", { product });
};
const getProductPageFilter = async (req: Request, res: Response) => {
  const {
    factory = "",
    target = "",
    price = "",
    sort = "",
  } = req.query as {
    factory: string;
    target: string;
    price: string;
    sort: string;
  };
  const filter = {} as any;
  let sortP = {} as any;
  if (factory) {
    const factoryInput = factory.split(",");
    filter.factory = {
      in: factoryInput,
    };
  }
  if (target) {
    const targetInput = target.split(",");
    filter.target = {
      in: targetInput,
    };
  }
  if (price) {
    const priceInput = price.split(",");
    const priceFillter = [];

    for (let i = 0; i < priceInput.length; i++) {
      if (priceInput[i] === "duoi-10-trieu") {
        priceFillter.push({
          price: {
            lt: 10000000,
          },
        });
      }
      if (priceInput[i] === "10-15-trieu") {
        priceFillter.push({
          price: {
            gte: 10000000,
            lte: 15000000,
          },
        });
      }
      if (priceInput[i] === "15-20-trieu") {
        priceFillter.push({
          price: {
            gte: 15000000,
            lte: 20000000,
          },
        });
      }
      if (priceInput[i] === "duoi-10-trieu") {
        priceFillter.push({
          price: {
            lt: 10000000,
          },
        });
      }
      if (priceInput[i] === "tren-20-trieu") {
        priceFillter.push({
          price: {
            gt: 20000000,
          },
        });
      }
    }
    filter.OR = priceFillter;
  }
  if (sort) {
    if (sort === "gia-tang-dan") {
      sortP = {
        price: "asc",
      };
    }
    if (sort === "gia-giam-dan") {
      sortP = {
        price: "desc",
      };
    }
  }
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 6;
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage || 0;
  const params = { limit: Number(limit), skip, filter, sortP };
  const products = await getAllProductService(params);
  const totalProducts = (await prisma.product.findMany()).length;
  const totalPages = Math.ceil(products.length / perPage);
  return res.render("client/product/filter.ejs", {
    products,
    pagination: {
      page: currentPage,
      limit: perPage,
      total: totalProducts,
      totalPages,
    },
  });
};
export { getProductPage, getProductPageFilter };
