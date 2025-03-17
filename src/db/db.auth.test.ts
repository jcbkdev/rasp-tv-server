import { isAuthenticated, userAuth } from "./db.auth";
import { addUser, hasUser } from "./db";

test("user auth", async () => {
    const userExists = hasUser("test");
    if (!userExists) {
        addUser("test", "test");
        expect(hasUser("test")).toBeTruthy();
    }

    const authDetails = await userAuth("test", "test");
    expect(authDetails).not.toBeNull();

    const isAuth = isAuthenticated(authDetails!.user_id, authDetails!.us);
    expect(isAuth).toBeTruthy();
});
