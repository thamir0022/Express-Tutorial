import React, { useEffect, useState } from "react";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/user/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  return (
    <section>
      {products.length > 0 ? (
        products.map((p) => (
          <div className="">
            <p>{p.name}</p>
          </div>
        ))
      ) : (
        <p>No Products Available</p>
      )}
    </section>
  );
};

export default App;
