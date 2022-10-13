import { fn } from "@hwyblvd/st";
import { createSignal, Match, Switch } from "solid-js";

const [model, setModel] = createSignal("Tags");

export const ModelSelect = fn(() => {
    return (
        <select value={model()} onChange={e => setModel(e.currentTarget.value)}>
            <option textContent="Tags" />
            <option textContent="Location" />
            <option textContent="Cameras" />
        </select>
    );
});

export const ModelShow = fn(props => {
    return (
        <Switch>
            <Match when={model() == "Tags"} children={props.tags} />
            <Match when={model() == "Location"} children={props.location} />
            <Match when={model() == "Cameras"} children={props.cameras} />
        </Switch>
    )
}, { tags: <p/>, location: <p/>, cameras: <p/> });