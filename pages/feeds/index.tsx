import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  allPostsComments,
  allPostsLikes,
  allUsersPosts,
  deletePost,
} from "apiSetup";
import { H1, Tiny } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import React, { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BazaarImage from "components/BazaarImage";
import { Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { isWithinInterval, subWeeks, subMonths } from "date-fns";

const Index = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [deletePostId, setDeletePostId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await allUsersPosts();
        const likeResponse = await allPostsLikes();
        const commentsResponse = await allPostsComments();
        console.log(likeResponse, commentsResponse);
        if (response.status === 200) {
          setPosts(response.posts);
          setLikes(likeResponse.data);
          setComments(commentsResponse.data);
        } else {
          // Handle non-success response
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    const currentDate = new Date();
    switch (filterType) {
      case "weekly":
        return posts.filter((post) =>
          isWithinInterval(new Date(post.createdAt), {
            start: subWeeks(currentDate, 1),
            end: currentDate,
          })
        );
      case "monthly":
        return posts.filter((post) =>
          isWithinInterval(new Date(post.createdAt), {
            start: subMonths(currentDate, 1),
            end: currentDate,
          })
        );
      default:
        return posts;
    }
  }, [filterType, posts]);

  const handleOpenDeleteDialog = (postId) => {
    setDeletePostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeletePostId(null);
    setDeleteDialogOpen(false);
  };
  const handleDeletePost = async () => {
    try {
      // Perform API request to delete the post by deletePostId
      // Example: await deletePost(deletePostId);
      const response = await deletePost(deletePostId);
      console.log("response after Deleting ", response);

      // After successful deletion, update the state to reflect the change
      if (response.message === "Post deleted successfully.") {
        enqueueSnackbar("Post deleted successfully", {
          variant: "success",
        });

        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== deletePostId)
        );
      }

      // Close the delete confirmation dialog
      handleCloseDeleteDialog();
    } catch (error) {
      enqueueSnackbar("Failed to delete post", { variant: "error" });

      console.error("Error deleting post:", error);
      // Handle the error, e.g., show a notification to the user
    }
  };
  console.log("post", posts);
  // console.log("likes", likes);
  // console.log("comments", comments);
  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={4}>
        <H1>All Posts</H1>
        <Box mt={2}>
          <Button
            onClick={() => setFilterType("all")}
            style={{
              textDecoration: filterType === "all" ? "underline" : "none",
            }}
          >
            All
          </Button>
          <Button
            sx={{ ml: 2 }}
            onClick={() => setFilterType("weekly")}
            style={{
              textDecoration: filterType === "weekly" ? "underline" : "none",
            }}
          >
            Weekly
          </Button>
          <Button
            sx={{ ml: 2 }}
            onClick={() => setFilterType("monthly")}
            style={{
              textDecoration: filterType === "monthly" ? "underline" : "none",
            }}
          >
            Monthly
          </Button>
        </Box>
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          // height="100%"
          mt={30}
        >
          <CircularProgress sx={{ mr: 2 }} /> Please wait...
        </Box>
      ) : (
        <>
          {" "}
          <Grid container spacing={3} mb={3}>
            {filteredPosts?.map((post, index) => (
              <>
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <>
                        <Box
                          display="flex"
                          // alignItems="center"
                          justifyContent={"space-between"}
                        >
                          <Avatar
                            src={`${process.env.NEXT_PUBLIC_DEV_OPEN_URL}/uploads/${post?.profileInfo?.profilePhoto}`}
                            alt={post?.profileInfo?.name}
                            sx={{ width: 30, height: 30, mb: 17, mr: 2 }}
                          />
                          <BazaarImage
                            width={200}
                            height={200}
                            src={`${process.env.NEXT_PUBLIC_DEV_OPEN_URL}/uploads/${post?.media[0]}`}
                          />
                          <Delete
                            style={{
                              marginLeft: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenDeleteDialog(post._id)}
                          />
                        </Box>
                        <Typography>{post?.profileInfo?.name}</Typography>

                        <Typography fontSize={15} fontWeight={500}>
                          {post?.content}
                        </Typography>
                        <Typography variant="body2" color={"blue"}>
                          Liked By {post?.totalLikes}
                        </Typography>
                        <Typography variant="body2" color={"blue"}>
                          Commented by {post?.comments.length}
                        </Typography>
                        {post.comments.length > 0 && (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="comments-content"
                              id="comments-header"
                            >
                              <Typography>Comments</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box>
                                {post.comments.map((cmt, index) => (
                                  <Paper
                                    key={index}
                                    elevation={3}
                                    style={{
                                      padding: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <Tiny fontSize={15}>{cmt.text}</Tiny>
                                  </Paper>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ))}
          </Grid>
        </>
      )}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </VendorDashboardLayout>
  );
};

export default Index;
