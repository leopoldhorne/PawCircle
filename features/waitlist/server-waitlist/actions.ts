"use server"
import { google } from "googleapis";

interface Waitlist {
        firstName: string | undefined,
        lastName: string | undefined,
        email: string | undefined,
        petName: string | undefined,
        petType: string | undefined,
        socials: string | undefined,
        audienceSize: string | undefined,
        message: string | undefined
}

export async function updateValues(form: Waitlist) {
  const spreadsheetId = process.env.SHEETID;
  const range = "A:H";
  const valueInputOption = "USER_ENTERED";
  const callback = null;
  let values = [[form.firstName?.toLowerCase().trim(), form.lastName?.toLowerCase().trim(), form.email?.toLowerCase().trim(), form.petName?.toLowerCase().trim(), form.petType, form.socials, form.audienceSize, form.message, new Date().toISOString().replace('T', ' ').slice(0, 19)]];
  const body = {
    values: values,
  };
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ auth, version: "v4" });
    sheets.spreadsheets.values
      .append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        requestBody: body,
      })
      .then((response) => {
        const result = response;
        console.log(`${response.data.updates?.updatedRange} were updated`);
      });
  } catch (err) {
    console.log(err);
  }
}

export async function getEmails() {
  const spreadsheetId = process.env.SHEETID;
  const range = "C:C";
  const callback = null;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ auth, version: "v4" });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      })
    
    const data = response.data.values

    return data?.slice(1).map((elem) => elem[0])
  } catch (err) {
    console.log(err);
  }
}

export async function checkEmail(email: string | undefined) {
    const existingEmails = await getEmails()
    if (existingEmails?.includes(email?.toLowerCase().trim())) {
        return true
        // means they already exist
    }
    else{
        return false
        // means they are new yay
    }
}