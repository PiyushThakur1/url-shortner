const express = require("express");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs");

const app = express();

const fille = path.join(__dirname, "urls.json");
console.log(fille);
