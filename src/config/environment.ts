
const {env} = process;

export const environment ={
    node_env: env['NODE_ENV'],
    port: env['PORT'],
    debug: env["DEBUG"] == 'true',
    mongo_uri : env['MONGO_URI'] || '',
    password_salt: Number(env['PASSWORD_SALT'] || 10)
}