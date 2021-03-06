const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

let firstProduct;
test('POST /api/products', async() => {
    const response = await request(app)
        .post('/api/products')
        .send(newProduct);
    expect(response.statusCode).toBe(201);
    // express.json() middleware 덕분에 body로 들어올 수 있다.
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
});

test('should return 500 on POST /api/products', async() => {
    const response = await request(app)
        .post('/api/products')
        // 에러를 인위적으로 발생시키기 위해 아래와 같은 데이터 전달
        .send({ name: "phone" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." })
});

test('GET /api/products', async() => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    // response.body로 넘겨받은 데이터가 배열 데이터인지 확인
    expect(Array.isArray(response.body)).toBeTruthy();
    // 배열의 첫번째 요소의 name 속성이 정의가 되어있는지 확인
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    // 아래의 테스트 케이스에서 사용할 product 객체 초기화
    firstProduct = response.body[0];
});

test('GET /api/product/:productId', async() => {
    const response = await request(app)
        .get(`/api/products/${firstProduct._id}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
});

test('GET id doesnt exist /api/products/:productId', async() => {
    const response = await request(app).get('/api/products/609a2e5933b8440ef29a8eab');
    expect(response.statusCode).toBe(404);
});

// update시 통합 테스트
test('PUT /api/products', async() => {
    const res = await request(app)
        .put(`/api/products/${firstProduct._id}`)
        .send({ name: 'updated name', description: 'updated description' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('updated name');
    expect(res.body.description).toBe('updated description');
});

// update시에 에러가 발생하는 경우의 통합 테스트
test('Should return 404 on PUT /api/products', async() => {
    const res = await request(app)
        .put("/api/products" + "609a9ea141bdf69a851ba71a")
        .send({ name: 'updated name', description: 'updated description' })
    expect(res.statusCode).toBe(404);
});

test('DELETE /api/products', async() => {
    const res = await request(app)
        .delete(`/api/products/${firstProduct._id}`)
        .send();
    expect(res.statusCode).toBe(200);
});

test('DELETE id doesnt exist /api/products/:productId', async() => {
    const res = await request(app)
        .delete("/api/products/" + firstProduct._id)
        .send();
    expect(res.statusCode).toBe(404);

});