const userService = require("../services/user.service")
const joiSchemas=require("../validation/user.schema")
const cognitoService=require("../services/cognito.service")


module.exports.user_signup=async(req,res)=>{
  try {
    const userData=await joiSchemas.local_signup_post.validateAsync(req.body)
    const foundUser=await userService.getUserByEmail(userData.email)
    if(foundUser){
      return res.fail("User with this email already exists")
    }
    const newUser = await userService.createUser({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email.toLowerCase().trim(),
      cognito_id: userData.cognito_id,
    });

    return res.success(newUser,"User Created Successfully")
  } catch (error) {
    console.error("UserController [user_signup] Error: ", error);
    res.serverError(error);
  }
}

module.exports.get_me = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await userService.getCurrentUser(userId);
    return res.success(result,"User Fetched Successfully");
  } catch (error) {
    console.error("UserController [get_me] Error: ", error);
    res.serverError(error);
  }
};

module.exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.fail("Email and password are required");
    }
    const authTokens = await cognitoService.loginUser(email, password);

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.fail("User record not found in database.");
    }

    if (user.active === false) {
      return res.fail("Your account has been deactivated.");
    }
    return res.success({
      tokens: authTokens.AccessToken,
      user: user
    }, "User Logged in Successfully");

  } catch (error) {
    if (error.name === "NotAuthorizedException") {
      return res.fail("Incorrect email or password.");
    }
    console.error("UserController [user_login] Error: ", error);
    res.serverError(error);
  }
};