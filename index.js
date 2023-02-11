import { createAllRoutes, createFastifyBase } from "@hwyblvd/server";
import { fn } from "@hwyblvd/st";
import * as APIs from "./api/large.js";
import { metaDir } from "@hwyblvd/cli";
import { fastifyHttpProxy } from "@fastify/http-proxy";
import { fastifyStatic } from "@fastify/static";
import { findFreePorts } from "find-free-ports";
import { resolve } from "path";
import { exec } from "child_process";
import OU from "openurl";

const setup = fn(async props => {
    
    const [, portFrontend, portApi] = await findFreePorts(3, { startPort: 10_000 });

    props.port = portApi;

    for (const route in APIs) // @ts-ignore
        if(typeof APIs[route] == "function") // @ts-ignore
            props.routes.push({ url: `/api/v1/${route}`, handler: APIs[route] });
    
    exec(`cd app && npx -y vite --host ${props.host} --port ${portFrontend}`)

    props.fastify.register(fastifyHttpProxy, {
        upstream: `http://${props.host}:${portFrontend}/`,
        prefix: "/",
        httpMethods: ["GET"]
    });

    props.fastify.register(fastifyStatic, { 
        root: resolve(`${metaDir(import.meta)}/data/all`),
        prefix: "/i/",
    });

    createFastifyBase(props);
    createAllRoutes(props);

    await new Promise(r => setTimeout(r, 800))
    OU.open(`http://${props.host}:${props.port}`);

}, createAllRoutes, createFastifyBase);

// @ts-ignore
setup({});