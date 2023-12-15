import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { allPostsComments, allPostsLikes, allUsersPosts } from "apiSetup";
import { H1, Tiny } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BazaarImage from "components/BazaarImage";

const Index = () => {
  const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
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
  console.log("post", posts);
  console.log("likes", likes);
  console.log("comments", comments);
  return (
    <VendorDashboardLayout>
      <Box mt={4} mb={4}>
        <H1>All Posts</H1>
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
            {posts?.map((post, index) => (
              <>
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <>
                        <Box display="flex" alignItems="center">
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
    </VendorDashboardLayout>
  );
};

export default Index;
