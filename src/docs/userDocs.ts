const listUsers = {
    tags: ["User"],
    description: "Return a list of all users in the database",
    security: [{ "bearerAuth": [] }],
    responses: {
        200: {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            count: { type: "integer" },
                            users: { type: "array", items: { type: "string" } }
                        },
                        example: {
                            count: 0,
                            users: []
                        }
                    }
                }
            }
        }
    }
};

const getOneUser = {
    tags: ["User"],
    description: "Return a user with a given ID",
    security: [{ "bearerAuth": [] }],
    responses: {
        200: {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            username: { type: "string" },
                            email: { type: "string" },
                            password: { type: "string" },
                            profile: { type: "string" },
                            role: { type: "string", enum: ['admin', 'author', 'reader'] }
                        },
                        example: {
                            username: "example_user",
                            email: "user@example.com",
                            password: "hashedpassword",
                            profile: "",
                            role: "reader"
                        }
                    }
                }
            }
        }
    }
};

const createUser = {
    tags: ["User"],
    description: "Create a new user",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            minLength: 3,
                            maxLength: 255,
                        },
                        email: {
                            type: "string",
                            maxLength: 100,
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 255,
                        },
                        profile: {
                            type: "string",
                            default: "",
                        },
                        role: {
                            type: "string",
                            enum: ['admin', 'author', 'reader'],
                            maxLength: 20,
                            default: "reader",
                        },
                    },
                    required: ["username", "email", "password"],
                },
            },
        },
    },
    responses: {
        "201": {
            description: "User created successfully",
        },
    },
};

const putUser = {
    tags: ["User"],
    description: "Update an existing user",
    security: [{ "bearerAuth": [] }],
    parameters: [
        {
            name: "userId",
            in: "path",
            description: "ID of the user to update",
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
                        username: {
                            type: "string",
                            minLength: 3,
                            maxLength: 255,
                        },
                        email: {
                            type: "string",
                            maxLength: 100,
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 255,
                        },
                        profile: {
                            type: "string",
                        },
                        role: {
                            type: "string",
                            enum: ['admin', 'author', 'reader'],
                            maxLength: 20,
                        },
                    },
                },
            },
        },
    },
    responses: {
        "200": {
            description: "User updated successfully",
        },
        "404": {
            description: "User not found",
        },
    },
};

const deleteUser = {
    tags: ["User"],
    description: "Delete an existing user",
    security: [{ "bearerAuth": [] }],
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID of the user to delete",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        "204": {
            description: "User deleted successfully",
        },
        "404": {
            description: "User not found",
        },
    },
};

const UserDocs = {
    "/api/users": {
        get: {
            summary: "Get a list of all users",
            ...listUsers,
        },
        post: {
            summary: "Create a new user",
            ...createUser,
        },
    },
    "/api/users/{id}": {
        get: {
            summary: "Get user by ID",
            ...getOneUser,
        },
        put: {
            summary: "Update an existing user",
            ...putUser,
        },
        delete: {
            summary: "Delete an existing user",
            ...deleteUser,
        },
    },
};

export default UserDocs;
