const fastify = require('fastify')({ logger: process.env.USE_LOGGER ?? false });
const GhostAdminApi = require('@tryghost/admin-api');

const admin = new GhostAdminApi({
    url: process.env.GHOST_URL,
    key: process.env.GHOST_ADMIN_KEY,
    version: 'v5.2'
});

fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
});

fastify.post('/subscribe', async (request, reply) => {
    // check if the requesting server is authorized
    if (request.headers['x-service-authorization'] !== process.env.SERVICE_AUTHORIZATION) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    const { email } = request.body;
    
    // check if email exists
    if (!email) {
        reply.code(400).send({ error: 'You did not provide an email address' });
        return;
    }
    
    // check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        reply.code(400).send({ error: 'The email address you provided is invalid' });
        return;
    }

    // check if email already exists
    const existing = await admin.members.browse({ limit: 1, where: { email } })
    if (existing.length > 0) {
        reply.code(400).send({ error: 'Someone already subscribed with that email address' });
        return;
    }

    return admin.members.add({ email });
})

const start = async () => {
    try {
        await fastify.listen(4000);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
