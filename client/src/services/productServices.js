import api from "./api";
export async function fetchProducts(category, name) {
  const cleanCategory =
    category === "All Categories" || name ? undefined : category;

  const res = await api.get(`/api/products`, {
    params: {
      //   category: "Books & Media",
      category: cleanCategory,
      name: name,
    },
  });

  return res.data;
}
