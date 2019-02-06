export default {
    common: {
        cancel: "Cancel",
        delete: "Delete",
        save: "Save"
    },
    user: {
        profile: {
            edit: "Edit my Profile",
            biography: "Biography",
            fieldDescriptions: {
                bio: 'Bio (limit 10000 characters)'
            }
        }
    },
    login: {
        createAccount: "Create Account",
        checkingAvailability: "Checking Availability",
        createAccountPrompt: "You're almost there! You just need to pick a username.",
        createAccountFailure: "Unable to create your account. Try again later.",
        email: "Email",
        email_placeholder: "you@example.com",
        emailInUse: "You already have an account! Try Logging In",
        hasAccount: "Already have an account?",
        invalidUsername: "That username is unavailable. Try a different one",
        logIn: "Log In",
        loginPrompt: "Log in to your account",
        noAccount: "Don't have an account?",
        registerPrompt: "Enter your email address to create an account!",
        sendLoginSuccess: "Check your email for login information.",
        sendLoginFailure: "Request Failed. Try again later.",
        sendRegisterSuccess: "Check your email for to register.",
        sendRegisterFailure: "Request Failed. Try again later.",
        switchToLogin: "Log in!",
        signUp: "Sign Up!",
        signUpPrompt: "Make one!",
        unavailable(username: string) { return `'${username}' is unavailable`; },
        username_placeholder: "your-username"
    },
    header: {
        profile: 'Profile',
        logout: 'Logout',
        post: 'New Post',
        home: 'Home'
    },
    compose: {
        title: {
            placeholder: 'My Post Title',
        },
        body: {
            placeholder: 'Some stuff I want to write about',
        },
        post: 'Post',
        sendSuccess: 'Check out your new post!',
        sendFailure: 'Failed to create a new post. Try again later.'
    },
    edit: {
        sendSuccess: 'Check out your updated post!',
        sendFailure: 'Failed to update post. Try again later.',
        update: 'Update'
    },
    feed: {
        loadMore: 'Load More Posts',
        allPostsLoaded: 'There are no more posts to load'
    },
    post: {
        actions: {
            link: 'Link',
            edit: 'Edit',
            delete: 'Delete'
        },
        delete: {
            prompt: "Are you sure you want to delete this post? The operation cannot be undone.",
            header: "Delete Post"
        }
    },
    errors: {
        unknown: "An error occurred. Try again later.",
        notFound: "Page wasn't found! Maybe you don't permission to it or you mistyped the URL?",
        connectionError: "We had trouble loading the page. Try again later."
    }
};