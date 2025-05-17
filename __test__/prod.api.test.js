function apiTest(path) {
    describe(`Get ${path}`, () => {
        if (false) {
            it("Production mbktechstudio should return status 200", async () => {
                const response = await fetch(`https://mbktechstudio.com${path}`, {});
                expect(response.status).toBe(200);
            });
        }
    });
}

apiTest("/api/tickets/T000111333");
apiTest("/api/get-ticket/T000111333");
apiTest("/api/poratlAppVersion");
apiTest("/api/poratlAppUrl");
apiTest("/script/setup.sh");