import { User } from "models/user";
import { userData } from "lib/customTypes";

export async function getUserById(id: string): Promise<userData> {
    const user = new User(id);
    await user.pull();
    return user.data;
}

export async function patchUserData(id: string, userNewData: userData): Promise<any> {
    const user = new User(id);
    user.data = userNewData;
    const error = await user.push();
    if (!error) {
        return true;
    } else {
        return error;
    }
}

export async function patchOneUserData(id: string, dataName, dataToUpdate): Promise<any> {
    const user = new User(id);
    await user.pull();
    user.data[dataName] = dataToUpdate;
    const error = await user.push();
    if (!error) {
        return true;
    } else {
        return error;
    }
}
