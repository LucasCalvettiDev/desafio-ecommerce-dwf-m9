import * as SibApiV3Sdk from "sib-api-v3-sdk";

SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

export const sendEmail = new SibApiV3Sdk.TransactionalEmailsApi();
