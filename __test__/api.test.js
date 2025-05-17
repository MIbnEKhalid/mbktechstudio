function apiTest(path) {
    describe(`Get ${path}`, () => {
        it("localhost should return status 200", async () => {
            const response = await fetch(`http://localhost:3000${path}`, {});
            expect(response.status).toBe(200);
        });
    });
}

apiTest("/api/tickets/T000111333");
apiTest("/api/get-ticket/T000111333");
apiTest("/api/poratlAppVersion");
apiTest("/api/poratlAppUrl");
apiTest("/script/setup.sh");