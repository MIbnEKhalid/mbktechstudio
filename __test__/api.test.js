
function testMetaKeywords(path) {
    describe(`Get ${path}`, () => {
        it("should return status 200", async () => {
            const response = await fetch(`http://localhost:3000${path}`, {
            });
            expect(response.status).toBe(200);
        });
    });
}


testMetaKeywords(
    "/api/tickets/T000111333"
);
testMetaKeywords(
    "/api/get-ticket/T000111333"
);