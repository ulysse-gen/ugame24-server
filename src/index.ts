import dotenv from "dotenv";

import uGameClass from "./classes/uGame";
import jwt from "jsonwebtoken";

//
// Init main variables & default objects
//
dotenv.config();

const uGame = new uGameClass();

uGame.Start();