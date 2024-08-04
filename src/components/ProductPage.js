import React from "react";
import ProductTable from "./components/ProductTable";
import { Container, Typography } from "@mui/material";
import ProductCountDisplay from "./components/ProductCountDisplay";
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
