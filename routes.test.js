process.env.NODE_ENV = "test;"

const request = require("supertest")

const app = require('./app')
let items = require("./fakeDb")

let toothpaste = {name:"toothpaste", price: 3.29}

beforeEach(function(){
    items.push(toothpaste)
})

afterEach(function(){
    items.length = 0
})

describe("GET /items",()=>{
    test("Get all items", async ()=>{
        const res = await request(app).get('/items')
        expect(res.statusCode).toBe(200)
    })
})

describe("POST /items",()=>{
    test("Create new item", async ()=>{
        const res = await request(app).post('/items').send({name:'apples',price:3.99})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({item: {name:'apples',price:3.99}})
    })
    test("Responds with 400 if name is missing", async ()=>{
        const res = await request(app).post(`/items`).send({price:3.99})
        expect(res.statusCode).toBe(400)
    })

    test("Responds with 400 if item is a duplicate", async ()=>{
        const res = await request(app).post(`/items`).send({name:"toothpaste", price: 3.29})
        expect(res.statusCode).toBe(400)
    })
})

describe("GET /items/:name",()=>{
    test("Get item by name", async ()=>{
        const res = await request(app).get(`/items/${toothpaste.name}`)
        expect(res.statusCode).toBe(200)
    })
    test("Responds with 404 for invalid name", async ()=>{
        const res = await request(app).get(`/items/foobar`)
        expect(res.statusCode).toBe(404)
    })
})

describe("PATCH /items/:name",()=>{
    test("Update an item", async ()=>{
        const res = await request(app).patch(`/items/${toothpaste.name}`).send({name:'mouthwash',price:2.41})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated: {name:'mouthwash',price:2.41}})
    })

    test("Update only name", async ()=>{
        const res = await request(app).patch(`/items/${toothpaste.name}`).send({name:'floss'})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated: {name:'floss',price:2.41}})
    })

    test("Responds with 404 for invalid name", async ()=>{
        const res = await request(app).patch(`/items/foobar`).send({name:'floss'})
        expect(res.statusCode).toBe(404)
    })
})


describe("DELETE /items/:name",()=>{
    test("Delete an item", async ()=>{
        const res = await request(app).delete(`/items/${toothpaste.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Deleted" })
    })
    test("Responds with 404 for deleting invalid item", async ()=>{
        const res = await request(app).delete(`/items/foobar`)
        expect(res.statusCode).toBe(404)
    })
})