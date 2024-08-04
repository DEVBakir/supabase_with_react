import React from "react";
import { Container, Typography } from "@mui/material";
import ProductCountDisplay from "./components/ProductCountDisplay";
import ProductTable from "./ProductTable";
const ProductPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <ProductCountDisplay />
      <ProductTable />
    </Container>
  );
};

export default ProductPage;
