import Categories from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
function HomePage({ handleSelectedCategory, products, loading }) {
  if (loading)
    return (
      <h1 style={{ margin: "0 auto", marginTop: "300px", marginLeft: "150px" }}>
        Loading Products
      </h1>
    );
  return (
    <>
      {/* <HeroBanner /> */}

      <Categories OnSelectCategory={handleSelectedCategory} />
      <ProductGrid products={products} />
    </>
  );
}
export default HomePage;
