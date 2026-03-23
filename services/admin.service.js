const { USER_ROLES } = require("../constants");
const { User, UserRoles } = require("../models/index");
const CognitoService = require("./cognito.service");

module.exports.createAdmin = async (adminData) => {
  try {
    const congnitoUser = await CognitoService.createCognitoUser({
      email: adminData.email.toLowerCase().trim(),
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      email_verified: true,
    });

    console.log(`Cognito user created: `, congnitoUser);
    console.log(`Setting permanent password for admin: ${adminData.email}`);
    await CognitoService.setPermenantPassword({
      email: adminData.email,
      password: adminData.password,
    });
    console.log(`Password set successfully for admin: ${adminData.email}`);

    const user = await User.create({
      email: adminData.email.toLowerCase().trim(),
      cognito_id: congnitoUser.Username || congnitoUser,
      User: Username,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      email_verified: true,
    });

    await UserRoles.create({
      user_id: user.id,
      role: USER_ROLES.ADMIN,
    });

    const userData = user.toJSON();
    userData.role = USER_ROLES.ADMIN;
    return userData;
  } catch (error) {
    console.error("AdminService [createAdmin] Error:", error);
  }
};

module.exports.createUser = async (userData, targetRole, createRole) => {
  try {
    if (createRole === USER_ROLES.STAFF && targetRole !== USER_ROLES.AUDITOR) {
      throw new Error("Staff Member are only permitted to create auditor only");
    }

    const congnitoUser = await CognitoService.createCognitoUser({
      email: adminData.email.toLowerCase().trim(),
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      email_verified: true,
    });

    await CognitoService.setPermenantPassword({
      email: adminData.email,
      password: adminData.password,
    });
    const user = await User.create({
      email: userData.email.toLowerCase().trim(),
      cognito_id: cognitoUser.Username || cognitoUser,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email_verified: true,
    });

    // 4. Assign the Role (STAFF or AUDITOR)
    await UserRoles.create({
      user_id: user.id,
      role: targetRole,
    });

    return user.toJSON();
  } catch (error) {
    console.error("AdminService [CreateUser] Error :", error);
  }
};
