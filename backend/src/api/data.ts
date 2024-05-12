import { Request, Response } from "express"
import { generateAccessToken, verifyAccessToken, generateResetToken, generateAccessResetToken } from "../utils/token"
require("dotenv").config()
import { JsonWebTokenError } from "jsonwebtoken"
import { log } from "console"
import { prisma } from "../main"
import {parse} from "csv-parse"
import papaparse from "papaparse"
import fs from "fs"

function csvJSON(csv : string){

    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",").map((header) => header.split(" ")[0]);

    for(var i=1;i<lines.length;i++){
  
        var obj = new Map();
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            if (headers[j] !== "Description\r") {
                while (currentline[j].charAt(currentline[j].length - 1) === ' ') {
                    currentline[j] = currentline[j].substr(0, currentline[j].length - 1)
                }
            }
            obj.set(headers[j], currentline[j]);
        }
        
        result.push(obj);
  
    }
  
    return result
  }

/**
 * Route handler to upload data: /api/v1/data
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the user information
 */
export async function uploadData(req: Request, res: Response) {
    try {
        if (!req.headers.authorization) return res.status(400).send({ type: "error", error: "Not Authorized" })
        if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })

        const user = verifyAccessToken(req.headers.authorization.split(" ")[1])

        const file = req.file 
        const type = req.body.type

        if (!user.admin) return res.status(400).send({ type: "error", error: "Not Authorized" })
        if (!file) return res.status(400).send({ type: "error", error: "No file" })
        if (!type) return res.status(400).send({ type: "error", error: "No type" })

        // Check if a table with name type exists
        const table: object[] = await prisma.$queryRaw`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ${type}`
        // If table does not exist, create it

        const data = csvJSON(file.buffer.toString())

        if (table.length === 0) {
            // Create table
            let columns = data[0].keys()
            let header = Array.from(columns).map((column) => `${column} TEXT`).join(", ")
            await prisma.$queryRawUnsafe(`CREATE TABLE ${type} (id SERIAL PRIMARY KEY, ${header});`)
            // Insert data into table
            let headers = Array.from(columns).map((column) => `${column}`).join(", ")
            console.log(headers)
            for (let row of data) {
                let values = row.values()
                let value = Array.from(values).map((value: string) => {return value.replace("\"","'")}).join(", ")
                console.log(`INSERT INTO ${type} (${headers}) VALUES (${value})`)
                await prisma.$queryRawUnsafe("INSERT INTO ? (?) VALUES (?)", type, headers, value)
            }        
        }
        else {
            // Parse csv file and add data to table
            const csv = fs.readFileSync(file.buffer, "utf-8")
            const data = papaparse.parse(csv, {header: true}).data
            console.log(data)
        }



        

        res.status(200).send({ type: "success", data: user })
    } catch (error) {
        console.log(error)
        if (error instanceof JsonWebTokenError) return res.status(400).send({ type: "error", error: "Invalid token" })

        return res.status(500).send({ type: "error", error: "Internal Server Error" })
    }
}