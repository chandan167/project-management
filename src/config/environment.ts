
const {env} = process;

export const environment ={
    node_env: env['NODE_ENV'],
    port: env['PORT'],
    debug: env["DEBUG"] == 'true',
}