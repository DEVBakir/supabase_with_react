import React, { useEffect, useState } from "react";
import { Typography, Container } from "@mui/material";
import { supabase } from "../supabaseClient";

const ProductCountDisplay = () => {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function fetchProductCount() {
      const count = await getProductCount();
      setProductCount(count);
    }

    fetchProductCount();
  }, []);
  async function getProductCount() {
    try {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact" });

      if (error) throw error;

      return count;
    } catch (error) {
      console.error("Error fetching product count:", error.message);
      return 0;
    }
  }
  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Total Number of Products: {productCount}
      </Typography>
    </Container>
  );
};

export default ProductCountDisplay;
