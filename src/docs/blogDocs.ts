const listBlogs = {
    tags: ["Blog"],
    description: "Return a list of all blogs in the database",
    responses: {
        200: {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            count: { type: "integer" },
                            blogs: { type: "array", items: { type: "string" } }
                        },
                        example: {
                            count: 0,
                            blogs: []
                        }
                    }
                }
            }
        }
    }
};

const getOneBlog = {
    tags: ["Blog"],
    description: "Return a blog with a given ID",
    responses: {
        200: {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            count: { type: "integer" },
                            blogs: { type: "array", items: { type: "string" } }
                        },
                        example: {
                            count: 0,
                            blogs: []
                        }
                    }
                }
            }
        }
    }
}

const createBlog = {
    tags: ["Blog"],
    description: "Create a new blog post",
    security: [{ "bearerAuth": [] }],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 255,
                        },
                        content: {
                            type: "string",
                            minLength: 2,
                            maxLength: 1024 * 10, 
                        },
                        author: {
                            type: "string", 
                            description: "The ID of the author of the blog post",
                        },
                        likes: {
                            type: "array",
                            items: { type: "string" }, 
                            description: "An array of user IDs who liked the blog post",
                        },
                        comments: {
                            type: "array",
                            items: { type: "string" },
                            description: "An array of comments on the blog post",
                        },
                        category: {
                            type: "string",
                            description: "The category of the blog post",
                        },
                        status: {
                            type: "string",
                            description: "The status of the blog post (e.g., draft, published)",
                        },
                        thumbnail: {
                            type: "string",
                            description: "URL of the thumbnail image for the blog post",
                        },
                    },
                    required: ["title", "content", "author"], 
                },
            },
        },
    },
    responses: {
        "201": {
            description: "Blog post created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            _id: {
                                type: "string",
                                example: "1234567890abcdef",
                            },
                            title: {
                                type: "string",
                                example: "Blog Post Title",
                            },
                            content: {
                                type: "string",
                                example: "Blog Post Content",
                            },
                            author: {
                                type: "string",
                                example: "author123", // Assuming the author ID
                            },
                            likes: {
                                type: "array",
                                items: { type: "string" },
                                example: ["user1", "user2"], // Assuming user IDs
                            },
                            comments: {
                                type: "array",
                                items: { type: "string" },
                                example: ["comment1", "comment2"], // Assuming comment IDs
                            },
                            category: {
                                type: "string",
                                example: "Technology",
                            },
                            status: {
                                type: "string",
                                example: "published",
                            },
                            thumbnail: {
                                type: "string",
                                example: "https://example.com/thumbnail.jpg",
                            },
                        },
                    },
                },
            },
        },
    },
};
const getOneBlogById = {
    tags: ["Blog"],
    description: "Get a single blog post by its ID",
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the blog post to retrieve",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        "200": {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            _id: {
                                type: "string",
                                example: "1234567890abcdef",
                            },
                            title: {
                                type: "string",
                                example: "Blog Post Title",
                            },
                            content: {
                                type: "string",
                                example: "Blog Post Content",
                            },
                            author: {
                                type: "string",
                                example: "author123", 
                            },
                            likes: {
                                type: "array",
                                items: { type: "string" },
                                example: ["user1", "user2"], 
                            comments: {
                                type: "array",
                                items: { type: "string" },
                                example: ["comment1", "comment2"], 
                            },
                            category: {
                                type: "string",
                                example: "Technology",
                            },
                            status: {
                                type: "string",
                                example: "published",
                            },
                            thumbnail: {
                                type: "string",
                                example: "https://example.com/thumbnail.jpg",
                            },
                        },
                    },
                },
            },
        },
        "404": {
            description: "Blog post not found",
        },
    },
}
};


const putBlog = {
    tags: ["Blog"],
    description: "Update an existing blog post",
    security: [{ "bearerAuth": [] }],
    parameters: [
        {
            name: "blogId",
            in: "path",
            description: "ID of the blog post to update",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 255,
                        },
                        content: {
                            type: "string",
                            minLength: 2,
                            maxLength: 1024 * 10, // Assuming a maximum of 10KB content
                        },
                        author: {
                            type: "string", // Assuming author is referenced by _id
                            description: "The ID of the author of the blog post",
                        },
                        likes: {
                            type: "array",
                            items: { type: "string" }, // Assuming likes are referenced by _id
                            description: "An array of user IDs who liked the blog post",
                        },
                        comments: {
                            type: "array",
                            items: { type: "string" },
                            description: "An array of comments on the blog post",
                        },
                        category: {
                            type: "string",
                            description: "The category of the blog post",
                        },
                        status: {
                            type: "string",
                            description: "The status of the blog post (e.g., draft, published)",
                        },
                        thumbnail: {
                            type: "string",
                            description: "URL of the thumbnail image for the blog post",
                        },
                    },
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Blog post updated successfully",
        },
        "404": {
            description: "Blog post not found",
        },
    },
};

const deleteBlog = {
    tags: ["Blog"],
    description: "Delete an existing blog post",
    security: [{ "bearerAuth": [] }],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the blog post to delete",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        "204": {
            description: "Blog post deleted successfully",
        },
        "404": {
            description: "Blog post not found",
        },
    },
};


const BlogDocs = {
    "/api/blogs": {
        get: {
            summary: "Get a list of all blogs",
            ...listBlogs,
        },
        post: {
            summary: "Create a new blog post",
            ...createBlog,
        },
    },
    "/api/blogs/{id}": {
        get: {
            summary: "Get a single blog post by ID",
            ...getOneBlogById,
        },
        put: {
            summary: "Update an existing blog post",
            ...putBlog,
        },
        delete: {
            summary: "Delete an existing blog post",
            ...deleteBlog,
        },
    },
};

export default BlogDocs;
