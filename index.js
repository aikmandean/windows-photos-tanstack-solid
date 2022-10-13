import { discoverApiDefinitions, enableSwagger } from "@hwyblvd/swagger";
import { addFileRoutes, createAllRoutes, createFastifyBase } from "@hwyblvd/server";
import { createServingProxy } from "@hwyblvd/proxy";
import { fn } from "@hwyblvd/st";
import { metaDir } from "@hwyblvd/cli";

const setup = fn(async props => {
    await addFileRoutes(props)
    createServingProxy({
        ...props,
        upstreamUrl: "http://127.0.0.1:3000/",
        proxyEndpoint: "/"
    });
    createServingProxy({
        ...props,
        upstreamUrl: "http://127.0.0.1:3030/",
        proxyEndpoint: "/i/"
    });
    enableSwagger(props)
    discoverApiDefinitions(props);
    createFastifyBase(props);
    createAllRoutes(props);
}, enableSwagger, discoverApiDefinitions, addFileRoutes, createAllRoutes, createFastifyBase);

setup({
    path: "api",
    routes: [],
    port: 8080,
    host: "127.0.0.1",
    baseUrl: "http://localhost:8080",
    parent: metaDir(import.meta)
});