import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [chageData, setChangeData] = useState(false);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [chageData]);
  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
    } else {
      setArticle(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", id);

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddComment = async () => {
    const { name, email, content } = newComment;
    if (!name || !email || !content) {
      alert("Please fill in all fields.");
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        article_id: id,
        name,
        email,
        content,
      })
      .single();

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setChangeData((prev) => !prev);
      setNewComment({ name: "", email: "", content: "" });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {article && (
        <>
          <Typography variant="h4">{article.title}</Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {article.content}
          </Typography>
          {article.img_url && (
            <Box sx={{ marginBottom: 2 }}>
              <img
                src={article.img_url}
                alt={article.title}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}
          <Divider sx={{ marginY: 3 }} />
          <Typography variant="h5">Comments</Typography>
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${comment.name} (${comment.email})`}
                    secondary={comment.content}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h6">Add a Comment</Typography>
            <TextField
              label="Name"
              name="name"
              value={newComment.name}
              onChange={handleCommentChange}
              fullWidth
              sx={{ marginY: 1 }}
            />
            <TextField
              label="Email"
              name="email"
              value={newComment.email}
              onChange={handleCommentChange}
              fullWidth
              sx={{ marginY: 1 }}
            />
            <TextField
              label="Comment"
              name="content"
              value={newComment.content}
              onChange={handleCommentChange}
              fullWidth
              multiline
              rows={4}
              sx={{ marginY: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ marginTop: 2 }}
            >
              Add Comment
            </Button>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ArticleDetail;
