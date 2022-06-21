const express = require("express");
const app = express()
const routes = require('./routes')
const ExpressError = require("./expressError");


app.use(express.json())
app.use('/items', routes)

// Handle 404
app.use((req,res,next)=>{
    return new ExpressError("Not Found",404)
})

// Handle General Errors
app.use((err, req, res, next) => {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;
  
    // set the status and alert the user
    return res.status(status).json({
      error: { message, status },
    });
  });
  
module.exports = app
  