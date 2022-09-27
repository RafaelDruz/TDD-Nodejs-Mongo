let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {name: "userone", email: "rafa@gmail.com", password: "12345"};

beforeAll(() => {
    return request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(err => {console.log(err)})
})

afterAll(() => {
    return request.delete(`/user/${mainUser.email}`)
    .then(res => {})
    .catch(err => {console.log(err)})
})

describe("User registration", ()=> {
    test("Must register a user", () => {
        let time = Date.now(); 
        let email = `${time}@gmail.com`; 
        let user = {name: "userone", email, password: "12345"};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

        }).catch(error => {
            throw error;
        });

    })

    test("Prevent users from registering with empty data", () => {
         
        let user = {name: "", email: "", password: ""};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400);
          

        }).catch(error => {
            throw error;
        });
    })

    test("Prevent users from registering with more than one email", ()=> {
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "userone", email, password: "12345"};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

                return request.post("/user")
                .send(user)
                .then(res => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.body.error).toEqual("Email already exist")
                }).catch(error => {
                    throw error;
                })
        }).catch(error => {
            throw error;
        });
    });
    
});


describe("Authentication", () => {
    test("Return a token after login",() => {
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        }).catch(error => {
            throw error;
        })
    })
    test("Prevent user login before registering",() => {

        return request.post("/auth")
        .send({email: "xxsx", password: "8745sfs78f7s8"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.email).toEqual("This email is not registration");
        }).catch(error => {
            throw error;
        })
    })

    test("Prevent user login with wrong password",() => {

        return request.post("/auth")
        .send({email: mainUser.email, password: "8745sfs78f7s8dger"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.password).toEqual("Wrong password");
        }).catch(error => {
            throw error;
        })
    })

});

