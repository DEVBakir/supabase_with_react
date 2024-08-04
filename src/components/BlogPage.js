import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { styled } from "@mui/system";

// Styled components for classic look
const BlogCard = styled(Card)(({ theme }) => ({
  border: "1px solid #ddd",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

const BlogPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from("articles").select("*");

        if (error) throw error;
        setArticles(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontFamily: "Georgia, serif", color: "#333" }}
      >
        Blog
      </Typography>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <BlogCard>
              {article.img_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.img_url}
                  alt={article.title}
                />
              )}
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Georgia, serif", marginBottom: 1 }}
                >
                  {article.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {article.content.substring(0, 150)}...
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                  <Link
                    to={`/blog/${article.id}`}
                    style={{
                      textDecoration: "none",
                      color: "#007bff",
                      fontWeight: "bold",
                    }}
                  >
                    Read More
                  </Link>
                </Box>
              </CardContent>
            </BlogCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogPage;
