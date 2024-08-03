import React from "react";
import ProductTable from "./components/ProductTable";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <ProductTable />
    </Container>
  );
}

export default App;
