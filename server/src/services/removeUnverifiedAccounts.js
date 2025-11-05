import cron from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

const User = db.user;

export const removeUnverfiedAccounts = () => {
    cron.schedule("*/5 * * * *", async () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await User.destroy({
            where : {
                accountVerified : false,
                createdAt : {
                    [Op.lt] : thirtyMinutesAgo,
                }
            }
        })
    })
}