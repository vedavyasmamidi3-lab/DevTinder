#required apis
authRouter
-post /signup
-post /login
-post /logout

profileRouter
-Get /profile/view
-patch /profile/edit
-patch /profile/password

connectionRequestrRouter
-Post /request/send/intrested/:userID
-Post /request/send/ignored/:userId

userRouter
-Get /user/connections
-Get /user/request/recieved
-Get /user/feed -Gets you the profiles of other users on platform

status: ignore,intrested,accepted,rejected