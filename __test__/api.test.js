function apiTest(path) {
    describe(`Get ${path}`, () => {
        it("should return status 200", async() => {
            const response = await fetch(`http://localhost:3000${path}`, {});
            expect(response.status).toBe(200);
        });
    });
}

apiTest("/api/tickets/T000111333");
apiTest("/api/get-ticket/T000111333");
apiTest("/api/Unilib/Book");
apiTest("/api/Unilib/QuizAss");
apiTest("/api/poratlAppVersion");
apiTest("/api/poratlAppUrl");